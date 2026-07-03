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
    <Card className="rounded-[36px] border-0 bg-white p-7 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Top Clients</h2>
        <p className="mt-1 text-sm text-slate-500">Highest revenue contributors</p>
      </div>

      <div className="space-y-4">
        {groupByClientData.map((client, i) => (
          <div
            key={client.clientId}
            className="flex items-center justify-between rounded-3xl bg-slate-50 p-5 transition-all duration-200 hover:bg-slate-100"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-2xl">
                <AvatarFallback className={`rounded-2xl font-semibold ${avatarPalette[i % avatarPalette.length]}`}>
                  {client.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold text-slate-900">{client.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {client.invoices} invoice{client.invoices !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">
                ${(client.totalPaid / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>

              <div className="mt-2 flex items-center justify-end gap-1 text-xs font-medium text-[#0F2A4A]">
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