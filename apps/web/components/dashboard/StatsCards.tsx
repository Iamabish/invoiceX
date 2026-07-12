import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  FileCheck,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import {prisma} from "@invoicex/db"
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

  return (
    <section className="space-y-5">
      <Card className="relative overflow-hidden rounded-[24px] border-0 bg-[#0F2A4A] p-6 shadow-sm lg:rounded-[30px] lg:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/20 blur-2xl" />

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-300">
            Revenue
          </p>

          <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <ArrowUpRight className="h-3 w-3" />
            12%
          </span>
        </div>

        <h2 className="mt-6 text-4xl font-bold leading-none tracking-tight text-white xl:text-[46px]">
          ${((revenue._sum.total ?? 0) / 100).toLocaleString()}
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          {revenue._count} invoices paid this month
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm lg:rounded-[26px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
            <FileCheck className="h-5 w-5 text-sky-600" />
          </div>

          <h3 className="mt-5 text-2xl font-bold text-slate-900 lg:text-3xl">
            {revenue._count}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Paid
          </p>
        </Card>

        <Card className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm lg:rounded-[26px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
            <Clock3 className="h-5 w-5 text-sky-600" />
          </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 lg:text-2xl">
        ${((awaitingPayment._sum.total ?? 0) / 100).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h3>

          <p className="mt-1 text-sm text-slate-500">
            Awaiting
          </p>
        </Card>
      </div>

      <Card className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:rounded-[28px]">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        </div>

        <h3 className="mt-6 text-3xl font-bold text-slate-900 lg:text-4xl">
          {overdueCount}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Overdue invoices
        </p>
      </Card>
    </section>
  );
}