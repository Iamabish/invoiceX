import { ROLE, INVOICE_STATUS } from "../app/generated/prisma";
import { faker } from "@faker-js/faker";
import { hashPassword } from "better-auth/crypto";
import prisma from "@/lib/prisma";

faker.seed(42);

const NUM_REGULAR_USERS = 5;
const CLIENTS_PER_USER = 12;
const MIN_INVOICES_PER_CLIENT = 2;
const MAX_INVOICES_PER_CLIENT = 6;
const PASSWORD_PLAIN = "Password123!";

const STATUS_CYCLE: INVOICE_STATUS[] = [
  INVOICE_STATUS.SENT,
  INVOICE_STATUS.OVERDUE,
  INVOICE_STATUS.PAID,
  INVOICE_STATUS.DRAFT,
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

// generates a random date within the last 12 months
function randomDateInLastYear(): Date {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  return faker.date.between({ from: oneYearAgo, to: now });
}

// generates paidAt spread across last 12 months, one per month
function paidAtForMonth(monthsAgo: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(faker.number.int({ min: 1, max: 28 }));
  date.setHours(faker.number.int({ min: 9, max: 17 }), 0, 0, 0);
  return date;
}

async function main() {
  console.log("🧹 Cleaning database...");
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.client.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  console.log("🔐 Hashing shared password...");
  const passwordHash = await hashPassword(PASSWORD_PLAIN);

  console.log("👤 Creating users...");

  const admin = await prisma.user.create({
    data: {
      name: "Ava Administrator",
      email: "admin@example.com",
      password: passwordHash,
      role: ROLE.ADMIN,
      emailVerified: true,
      image: faker.image.avatarGitHub(),
    },
  });

  const unverifiedUser = await prisma.user.create({
    data: {
      name: "Uma Unverified",
      email: "unverified@example.com",
      password: passwordHash,
      role: ROLE.USER,
      emailVerified: false,
    },
  });

  const oauthOnlyUser = await prisma.user.create({
    data: {
      name: "Oscar OAuthOnly",
      email: "oauth.only@example.com",
      password: null,
      role: ROLE.USER,
      emailVerified: true,
      image: faker.image.avatarGitHub(),
    },
  });

  const regularUsers = [];
  for (let i = 0; i < NUM_REGULAR_USERS; i++) {
    const name = faker.person.fullName();
    const user = await prisma.user.create({
      data: {
        name,
        email: faker.internet.email({ firstName: name.split(" ")[0] }).toLowerCase(),
        password: passwordHash,
        role: ROLE.USER,
        emailVerified: faker.datatype.boolean({ probability: 0.85 }),
        image: faker.datatype.boolean() ? faker.image.avatarGitHub() : null,
      },
    });
    regularUsers.push(user);
  }

  const allLoginableUsers = [admin, unverifiedUser, ...regularUsers];

  console.log("🔗 Creating accounts...");
  for (const user of allLoginableUsers) {
    await prisma.account.create({
      data: {
        id: faker.string.uuid(),
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: passwordHash,
      },
    });
  }

  await prisma.account.create({
    data: {
      id: faker.string.uuid(),
      accountId: faker.string.numeric(10),
      providerId: "google",
      userId: oauthOnlyUser.id,
      accessToken: faker.string.alphanumeric(40),
      refreshToken: faker.string.alphanumeric(40),
      idToken: faker.string.alphanumeric(60),
      accessTokenExpiresAt: faker.date.future(),
      refreshTokenExpiresAt: faker.date.future({ years: 1 }),
      scope: "openid email profile",
    },
  });

  await prisma.account.create({
    data: {
      id: faker.string.uuid(),
      accountId: faker.string.numeric(10),
      providerId: "google",
      userId: regularUsers[0].id,
      accessToken: faker.string.alphanumeric(40),
      refreshToken: faker.string.alphanumeric(40),
      idToken: faker.string.alphanumeric(60),
      accessTokenExpiresAt: faker.date.future(),
      refreshTokenExpiresAt: faker.date.future({ years: 1 }),
      scope: "openid email profile",
    },
  });

  console.log("🪪 Creating sessions...");
  for (const user of allLoginableUsers) {
    await prisma.session.create({
      data: {
        id: faker.string.uuid(),
        token: faker.string.alphanumeric(48),
        userId: user.id,
        expiresAt: faker.date.soon({ days: 14 }),
        ipAddress: faker.internet.ipv4(),
        userAgent: faker.internet.userAgent(),
      },
    });
  }

  await prisma.session.create({
    data: {
      id: faker.string.uuid(),
      token: faker.string.alphanumeric(48),
      userId: regularUsers[1].id,
      expiresAt: faker.date.recent({ days: 5 }),
      ipAddress: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
    },
  });

  await prisma.session.create({
    data: {
      id: faker.string.uuid(),
      token: faker.string.alphanumeric(48),
      userId: regularUsers[2].id,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
      ipAddress: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
    },
  });

  console.log("✉️  Creating verification tokens...");
  await prisma.verification.create({
    data: {
      id: faker.string.uuid(),
      identifier: unverifiedUser.email,
      value: faker.string.alphanumeric(32),
      expiresAt: faker.date.soon({ days: 1 }),
    },
  });

  await prisma.verification.create({
    data: {
      id: faker.string.uuid(),
      identifier: "stale.signup@example.com",
      value: faker.string.alphanumeric(32),
      expiresAt: faker.date.recent({ days: 3 }),
    },
  });

  console.log("🧾 Creating clients, invoices, and invoice items...");

  const companyPool = [
    "Acme Inc", "Acme Logistics", "Globex Corporation", "Initech",
    "Umbrella Industries", "Stark Enterprises", "Wayne Holdings",
    "Hooli LLC", "Soylent Co", "Vandelay Industries",
  ];

  let clientCounter = 0;
  // track paid invoice index per user for monthly distribution
  let paidMonthCursor: Record<string, number> = {};

  for (const owner of regularUsers) {
    let userInvoiceCounter = 0; // per-user invoice sequence
    paidMonthCursor[owner.id] = 0;

    for (let c = 0; c < CLIENTS_PER_USER; c++) {
      clientCounter++;
      const clientName = faker.person.fullName();
      const company = pick(companyPool, clientCounter);

      const client = await prisma.client.create({
        data: {
          name: clientName,
          email: faker.internet.email({ firstName: clientName.split(" ")[0] }).toLowerCase(),
          company,
          phone: faker.phone.number({ style: "international" }),
          address: faker.location.streetAddress({ useFullAddress: true }),
          userId: owner.id,
        },
      });

      const isEmptyClient = owner.id === regularUsers[0].id && c === 0;
      if (isEmptyClient) continue;

      const invoiceCount = faker.number.int({
        min: MIN_INVOICES_PER_CLIENT,
        max: MAX_INVOICES_PER_CLIENT,
      });

      for (let i = 0; i < invoiceCount; i++) {
        userInvoiceCounter++;

        const status = pick(STATUS_CYCLE, userInvoiceCounter);

        // dates based on status
        let issueDate: Date;
        let dueDate: Date;
        let paidAt: Date | null = null;

        if (status === INVOICE_STATUS.PAID) {
          // spread paid invoices across last 12 months for dashboard charts
          const monthsAgo = paidMonthCursor[owner.id] % 12;
          paidMonthCursor[owner.id]++;
          paidAt = paidAtForMonth(monthsAgo);
          issueDate = new Date(paidAt);
          issueDate.setDate(issueDate.getDate() - faker.number.int({ min: 7, max: 30 }));
          dueDate = new Date(paidAt);
          dueDate.setDate(dueDate.getDate() - faker.number.int({ min: 1, max: 5 }));
        } else if (status === INVOICE_STATUS.OVERDUE) {
          // overdue = due date in the past
          dueDate = faker.date.recent({ days: 60 });
          issueDate = new Date(dueDate);
          issueDate.setDate(issueDate.getDate() - faker.number.int({ min: 7, max: 30 }));
        } else if (status === INVOICE_STATUS.SENT) {
          // sent = due date in the future
          dueDate = faker.date.soon({ days: 60 });
          issueDate = new Date(dueDate);
          issueDate.setDate(issueDate.getDate() - faker.number.int({ min: 7, max: 30 }));
        } else {
          // draft = recent dates
          issueDate = randomDateInLastYear();
          dueDate = new Date(issueDate);
          dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 14, max: 45 }));
        }

        const itemCount = faker.number.int({ min: 1, max: 5 });
        const items = Array.from({ length: itemCount }).map(() => ({
          description: faker.commerce.productDescription(),
          quantity: faker.number.int({ min: 1, max: 10 }),
          unitPrice: faker.number.int({ min: 500, max: 50000 }),
        }));

        const subTotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
        const taxRate = 8;
        const tax = Math.round(subTotal * (taxRate / 100)); // fixed
        const total = subTotal + tax;

        const invoice = await prisma.invoice.create({
          data: {
            userId: owner.id,
            clientId: client.id,
            invoiceNumber: `INV-${String(userInvoiceCounter).padStart(4, '0')}`, // per-user
            subTotal,
            taxRate,
            tax,
            total,
            issueDate,
            dueDate,
            status,
            paidAt,  // set for PAID invoices
            paymentToken: faker.string.alphanumeric(24),
          },
        });

        const isEmptyInvoice = owner.id === regularUsers[0].id && c === 1 && i === 0;
        if (!isEmptyInvoice) {
          await prisma.invoiceItem.createMany({
            data: items.map((it) => ({ ...it, invoiceId: invoice.id })),
          });
        }
      }
    }
  }

  const [userCount, clientCount, invoiceCount, itemCount, sessionCount, accountCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.client.count(),
      prisma.invoice.count(),
      prisma.invoiceItem.count(),
      prisma.session.count(),
      prisma.account.count(),
    ]);

  const statusBreakdown = await prisma.invoice.groupBy({
    by: ["status"],
    _count: true,
  });

  console.log("\n✅ Seed complete!");
  console.log("----------------------------------------");
  console.log(`Users:     ${userCount}`);
  console.log(`Clients:   ${clientCount}`);
  console.log(`Invoices:  ${invoiceCount}`);
  console.log(`Items:     ${itemCount}`);
  console.log(`Sessions:  ${sessionCount}`);
  console.log(`Accounts:  ${accountCount}`);
  console.log("Invoice status breakdown:");
  statusBreakdown.forEach((s) => console.log(`  ${s.status}: ${s._count}`));
  console.log("----------------------------------------");
  console.log("🔑 Login credentials:");
  console.log(`   password: ${PASSWORD_PLAIN}`);
  console.log(`   admin:        admin@example.com`);
  console.log(`   unverified:   unverified@example.com`);
  console.log(`   oauth-only:   oauth.only@example.com`);
  regularUsers.forEach((u, idx) => console.log(`   user ${idx + 1}:       ${u.email}`));
  console.log("----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });