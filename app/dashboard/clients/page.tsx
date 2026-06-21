import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MoreHorizontal, Plus } from "lucide-react";
import { headers } from "next/headers";
import SearchToggle from "@/components/shared/SearchToggle";
import ClientButton from "@/components/shared/ClientButton";
import ClientActions from "@/components/shared/ClientAction";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
};

const Client = async ({ searchParams }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { page, search } = await searchParams;

  const where: any = {
    userId: session?.user.id,
  };

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        company: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const currentPage = Number(page) || 1;
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const total = await prisma.client.count({
    where,
  });

  const totalPages = Math.ceil(total / limit);

  const fetchedClients = await prisma.client.findMany({
    where,
    take: limit,
    skip,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {total} client{total !== 1 && "s"}
          </p>
        </div>

       <ClientButton />
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold">
            All Clients ({total})
          </h2>

          <SearchToggle />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Invoices</th>
                <th className="px-6 py-3 font-medium">Total Billed</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="w-10"></th>
              </tr>
            </thead>

            <tbody>
              {fetchedClients.length > 0 ? (
                fetchedClients.map((client) => {
                  const initials = client.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={client.id}
                      className="border-b transition-colors hover:bg-muted/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                            {initials}
                          </div>

                          <div>
                            <p className="font-medium">{client.name}</p>

                            <p className="text-sm text-muted-foreground">
                              {client.company}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {client.email}
                      </td>

                      <td className="px-6 py-4">—</td>

                      <td className="px-6 py-4">—</td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {client.createdAt.toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                       <ClientActions
                        client={{
                            id: client.id,
                            name: client.name,
                            email: client.email,
                            company: client.company,
                            phone: client.phone,
                            address: client.address,
                        }}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-muted-foreground">
            <span>
              Page {currentPage} of {totalPages}
            </span>

            <span>
              Showing {fetchedClients.length} of {total} clients
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Client;