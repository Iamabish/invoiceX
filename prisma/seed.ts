/**
 * Comprehensive seed script
 * -------------------------
 * Covers:
 *  - Auth: admin + regular users, hashed passwords, OAuth-style Accounts,
 *          valid/expired/near-expiry Sessions, an unverified user.
 *  - Pagination: 60 clients spread across 5 users, 250+ invoices total.
 *  - Filtering: invoices across all PAYMENT_STATUS values, due dates in the
 *               past/today/future, varying totals (for range filters),
 *               clients with overlapping/duplicate names & companies
 *               (for search/autocomplete testing), one client with zero
 *               invoices, one invoice with zero items.
 *
 * Run with:  npx tsx prisma/seed.ts
 * (or wire it into package.json -> "prisma": { "seed": "tsx prisma/seed.ts" })
 *
 * Requires: @faker-js/faker
 *   npm i -D @faker-js/faker
 *
 * Passwords are hashed with better-auth's own `hashPassword` (better-auth/crypto),
 * NOT bcrypt — better-auth's signInEmail cannot verify bcrypt hashes.
 */

import { PrismaClient, ROLE, PAYMENT_STATUS } from "../app/generated/prisma";
import { faker } from "@faker-js/faker";
// better-auth ships its own scrypt-based password hashing. Credential
// passwords MUST be hashed with this (not bcrypt) or signInEmail will
// throw "Invalid password hash".
import { hashPassword } from "better-auth/crypto";

import prisma from "@/lib/prisma";

// ---------- deterministic randomness so re-running gives stable-ish data ----------
faker.seed(42);

// ---------- tunables ----------
const NUM_REGULAR_USERS = 5;
const CLIENTS_PER_USER = 12; // 5 * 12 = 60 clients -> good for pagination
const MIN_INVOICES_PER_CLIENT = 2;
const MAX_INVOICES_PER_CLIENT = 6;
const PASSWORD_PLAIN = "Password123!"; // same for every seeded user, for easy login testing

const STATUS_CYCLE: PAYMENT_STATUS[] = [
  PAYMENT_STATUS.PENDING,
  PAYMENT_STATUS.PROCESSING,
  PAYMENT_STATUS.PAID,
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

async function main() {
  console.log("🧹 Cleaning database...");
  // Order matters due to FK constraints
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.client.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  console.log("🔐 Hashing shared password...");
  const passwordHash = await hashPassword(PASSWORD_PLAIN);

  // ----------------------------------------------------------------------
  // USERS
  // ----------------------------------------------------------------------
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

  // A user that signed up but never verified their email (auth edge case)
  const unverifiedUser = await prisma.user.create({
    data: {
      name: "Uma Unverified",
      email: "unverified@example.com",
      password: passwordHash,
      role: ROLE.USER,
      emailVerified: false,
    },
  });

  // A user with NO password (OAuth-only account, e.g. Google sign-in)
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

  const allLoginableUsers = [admin, unverifiedUser, ...regularUsers]; // oauthOnlyUser excluded (no password)

  // ----------------------------------------------------------------------
  // ACCOUNTS (OAuth-style + credential rows) — auth testing
  // ----------------------------------------------------------------------
  console.log("🔗 Creating accounts...");

  // Credential account rows for the password-based users
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

  // OAuth account for the oauth-only user
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

  // Give one regular user BOTH a credential account and a linked Google account
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

  // ----------------------------------------------------------------------
  // SESSIONS — valid / expired / expiring soon
  // ----------------------------------------------------------------------
  console.log("🪪 Creating sessions...");

  for (const user of allLoginableUsers) {
    // Valid, active session
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

  // An already-expired session (auth edge case: expired token rejection)
  await prisma.session.create({
    data: {
      id: faker.string.uuid(),
      token: faker.string.alphanumeric(48),
      userId: regularUsers[1].id,
      expiresAt: faker.date.recent({ days: 5 }), // in the past
      ipAddress: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
    },
  });

  // A session expiring in the next few minutes (edge case: near-expiry refresh flow)
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

  // ----------------------------------------------------------------------
  // VERIFICATION — pending email verification tokens
  // ----------------------------------------------------------------------
  console.log("✉️  Creating verification tokens...");

  await prisma.verification.create({
    data: {
      id: faker.string.uuid(),
      identifier: unverifiedUser.email,
      value: faker.string.alphanumeric(32),
      expiresAt: faker.date.soon({ days: 1 }),
    },
  });

  // An expired verification token (edge case)
  await prisma.verification.create({
    data: {
      id: faker.string.uuid(),
      identifier: "stale.signup@example.com",
      value: faker.string.alphanumeric(32),
      expiresAt: faker.date.recent({ days: 3 }),
    },
  });

  // ----------------------------------------------------------------------
  // CLIENTS + INVOICES + INVOICE ITEMS
  // ----------------------------------------------------------------------
  console.log("🧾 Creating clients, invoices, and invoice items...");

  // A handful of repeated company/name fragments so search/filter UIs have
  // realistic overlap to query against (e.g. searching "Inc" or "Acme").
  const companyPool = [
    "Acme Inc",
    "Acme Logistics",
    "Globex Corporation",
    "Initech",
    "Umbrella Industries",
    "Stark Enterprises",
    "Wayne Holdings",
    "Hooli LLC",
    "Soylent Co",
    "Vandelay Industries",
  ];

  let clientCounter = 0;
  let invoiceCounter = 0;

  for (const owner of regularUsers) {
    for (let c = 0; c < CLIENTS_PER_USER; c++) {
      clientCounter++;
      const clientName = faker.person.fullName();
      const company = pick(companyPool, clientCounter);

      const client = await prisma.client.create({
        data: {
          name: clientName,
          email: faker.internet.email({ firstName: clientName.split(" ")[0] }).toLowerCase(),
          company,
          userId: owner.id,
        },
      });

      // Leave the very first client of the first user with zero invoices
      // (edge case: empty state in invoice list UI)
      const isEmptyClient = owner.id === regularUsers[0].id && c === 0;
      if (isEmptyClient) continue;

      const invoiceCount = faker.number.int({
        min: MIN_INVOICES_PER_CLIENT,
        max: MAX_INVOICES_PER_CLIENT,
      });

      for (let i = 0; i < invoiceCount; i++) {
        invoiceCounter++;

        // Spread due dates across past (overdue), today, and future
        const dueDate = faker.date.between({
          from: faker.date.recent({ days: 90 }),
          to: faker.date.soon({ days: 90 }),
        });

        const status = pick(STATUS_CYCLE, invoiceCounter);

        // Build 1-5 line items first, then derive totals so numbers are consistent
        const itemCount = faker.number.int({ min: 1, max: 5 });
        const items = Array.from({ length: itemCount }).map(() => ({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.number.int({ min: 500, max: 50000 }), // cents
        }));

        const subTotal = items.reduce((sum, it) => sum + it.price, 0);
        const taxRate = 0.08;
        const tax = Math.round(subTotal * taxRate);
        const total = subTotal + tax;

        const invoice = await prisma.invoice.create({
          data: {
            userId: owner.id,
            clientId: client.id,
            subTotal,
            tax,
            total,
            dueDate,
            status,
            paymentToken: faker.string.alphanumeric(24),
          },
        });

        // Edge case: one invoice with zero line items (e.g. draft never finalized)
        const isEmptyInvoice =
          owner.id === regularUsers[0].id && c === 1 && i === 0;

        if (!isEmptyInvoice) {
          await prisma.invoiceItem.createMany({
            data: items.map((it) => ({
              ...it,
              invoiceId: invoice.id,
            })),
          });
        }
      }
    }
  }

  // ----------------------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------------------
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
  console.log("🔑 Login credentials (shared password for all credential users):");
  console.log(`   password: ${PASSWORD_PLAIN}`);
  console.log(`   admin:        admin@example.com`);
  console.log(`   unverified:   unverified@example.com (emailVerified=false)`);
  console.log(`   oauth-only:   oauth.only@example.com (no password, google provider)`);
  regularUsers.forEach((u, i) =>
    console.log(`   user ${i + 1}:       ${u.email}`)
  );
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