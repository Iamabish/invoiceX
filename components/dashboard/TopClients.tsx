import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function TopClients() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const topClient = await prisma.invoice.groupBy({
    by: ["clientId"],
    where: {
      userId: user?.user.id,
      status: "PAID",
    },
    _sum: {
      total: true,
    },
    _count: {
      _all: true,
    },
    orderBy: {
      _sum: {
        total: "desc",
      },
    },
    take: 5,
  });

  const clientIds = topClient.map((item) => item.clientId);

  const clients = await prisma.client.findMany({
    where: {
      id: {
        in: clientIds,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
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
    <Card className="rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Top Clients</h2>

        <p className="text-sm text-muted-foreground">
          Highest revenue contributors
        </p>
      </div>

      <div className="space-y-5">
        {groupByClientData.map((client) => (
          <div
            key={client.clientId}
            className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {client.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">{client.name}</p>

                <p className="text-sm text-muted-foreground">
                  {client.invoices} invoice
                  {client.invoices !== 1 && "s"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                $
                {(client.totalPaid / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}