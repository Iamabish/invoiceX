import { Card } from "@/components/ui/card";
import {
  CircleDollarSign,
  FileCheck,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function StatsCards() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const now = new Date();

  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const startOfCurrMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const revenue = await prisma.invoice.aggregate({
    where: {
      userId: user?.user.id,
      status: "PAID",
      paidAt: {
        gte: startOfLastMonth,
        lt: startOfCurrMonth,
      },
    },
    _sum: {
      total: true,
    },
    _count: true,
  });

  const awaitingPayment = await prisma.invoice.aggregate({
    where: {
      userId: user?.user.id,
      status: "SENT",
    },
    _sum: {
      total: true,
    },
    _count: true,
  });

  const overdueCount = await prisma.invoice.count({
    where: {
      userId: user?.user.id,
      status: "OVERDUE",
    },
  });

  const cards = [
    {
      title: "Revenue (Last Month)",
      value: `$${((revenue._sum.total ?? 0) / 100).toLocaleString()}`,
      description: `${revenue._count} paid invoice${
        revenue._count !== 1 ? "s" : ""
      }`,
      icon: CircleDollarSign,
    },
    {
      title: "Paid Invoices",
      value: revenue._count.toString(),
      description: "Invoices paid last month",
      icon: FileCheck,
    },
    {
      title: "Awaiting Payment",
      value: `$${((awaitingPayment._sum.total ?? 0) / 100).toLocaleString()}`,
      description: `${awaitingPayment._count} invoice${
        awaitingPayment._count !== 1 ? "s" : ""
      } awaiting payment`,
      icon: Clock3,
    },
    {
      title: "Overdue",
      value: overdueCount.toString(),
      description: "Invoices past due date",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="rounded-2xl border bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl border bg-muted p-3">
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm text-muted-foreground">
                {card.title}
              </p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight">
                {card.value}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {card.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}