// StatsCards.tsx
import { Card } from "@/components/ui/card";
import { ArrowUpRight, FileCheck, Clock3, AlertTriangle } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function StatsCards() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfCurrMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const revenue = await prisma.invoice.aggregate({
    where: {
      userId: user?.user.id,
      status: "PAID",
      paidAt: { gte: startOfLastMonth, lt: startOfCurrMonth },
    },
    _sum: { total: true },
    _count: true,
  });

  const awaitingPayment = await prisma.invoice.aggregate({
    where: { userId: user?.user.id, status: "SENT" },
    _sum: { total: true },
    _count: true,
  });

  const overdueCount = await prisma.invoice.count({
    where: { userId: user?.user.id, status: "OVERDUE" },
  });

  return (
    <section className="space-y-5">
      {/* Hero card — matches "Pipeline Goal" treatment */}
      <Card className="relative overflow-hidden rounded-[30px] border-0 bg-[#0F2A4A] p-7 shadow-sm">
        {/* subtle radial accent, like the reference's branded card */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/20 blur-2xl" />

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-300">Revenue</p>

          <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <ArrowUpRight className="h-3 w-3" />
            12%
          </span>
        </div>

        <h2 className="mt-6 text-[46px] font-bold leading-none tracking-tight text-white">
          ${((revenue._sum.total ?? 0) / 100).toLocaleString()}
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          {revenue._count} invoices paid this month
        </p>
      </Card>

      {/* Paid + Awaiting — single light-blue accent, no rainbow */}
      <div className="grid grid-cols-2 gap-5">
        <Card className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
            <FileCheck className="h-5 w-5 text-sky-600" />
          </div>

          <h3 className="mt-5 text-3xl font-bold text-slate-900">
            {revenue._count}
          </h3>

          <p className="mt-1 text-sm text-slate-500">Paid</p>
        </Card>

        <Card className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
            <Clock3 className="h-5 w-5 text-sky-600" />
          </div>

          <h3 className="mt-5 text-3xl font-bold text-slate-900">
            ${((awaitingPayment._sum.total ?? 0) / 100).toLocaleString()}
          </h3>

          <p className="mt-1 text-sm text-slate-500">Awaiting</p>
        </Card>
      </div>

      {/* Overdue — kept as the one intentional exception, since it's a status alert, matching reference's dot-based status color use */}
      <Card className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        </div>

        <h3 className="mt-6 text-4xl font-bold text-slate-900">
          {overdueCount}
        </h3>

        <p className="mt-2 text-sm text-slate-500">Overdue invoices</p>
      </Card>
    </section>
  );
}