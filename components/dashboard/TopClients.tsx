// TopClients.tsx
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ArrowUpRight } from "lucide-react";

const avatarPalette = [
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
];

export default async function TopClients() {
  const user = await auth.api.getSession({ headers: await headers() });

  const topClient = await prisma.invoice.groupBy({
    by: ["clientId"],
    where: { userId: user?.user.id, status: "PAID" },
    _sum: { total: true },
    _count: { _all: true },
    orderBy: { _sum: { total: "desc" } },
    take: 5,
  });

  const clientIds = topClient.map((item) => item.clientId);

  const clients = await prisma.client.findMany({
    where: { id: { in: clientIds } },
    select: { id: true, name: true, email: true },
  });

  const groupByClientData = topClient.map((item) => {
    const client = clients.find((c) => c.id === item.clientId);
    return {
      clientId: client?.id,
      name: client?.name ?? "Unknown Client",
      email: client?.email,
      totalPaid: item._sum.total ?? 0,
      invoices: item._count._all,
    };
  });

  return (
  <Card className="rounded-[28px] border-0 bg-white p-5 shadow-sm sm:rounded-[36px] sm:p-7">
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
        Top Clients
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Highest revenue contributors
      </p>
    </div>

    <div className="space-y-4">
      {groupByClientData.map((client, i) => (
        <div
          key={client.clientId}
          className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 transition-all duration-200 hover:bg-slate-100 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:p-5"
        >
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="h-12 w-12 rounded-2xl flex-shrink-0">
              <AvatarFallback
                className={`rounded-2xl font-semibold ${
                  avatarPalette[i % avatarPalette.length]
                }`}
              >
                {client.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900">
                {client.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {client.invoices} invoice
                {client.invoices !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:block sm:text-right">
            <div>
              <p className="text-lg font-bold text-slate-900">
                $
                {(client.totalPaid / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Total Paid
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-[#0F2A4A] sm:mt-2 sm:justify-end">
              Details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);
}