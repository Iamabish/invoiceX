import { auth } from "@/lib/auth";
import {prisma} from "@invoicex/db"
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import SearchToggle from "@/components/shared/SearchToggle";
import ClientButton from "@/components/shared/ClientButton";
import ClientActions from "@/components/shared/ClientAction";
import Search from "@/components/shared/Search";

const avatarPalette = [
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
];

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
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ];
  }

  const currentPage = Number(page) || 1;
  const limit = 5;
  const skip = (currentPage - 1) * limit;

  const total = await prisma.client.count({ where });
  const totalPages = Math.ceil(total / limit);

  const fetchedClients = await prisma.client.findMany({
    where,
    take: limit,
    skip,
    orderBy: { createdAt: "desc" },
  });

  const PAGE_SIZE = 5;

  const startPage = Math.floor((currentPage - 1) / PAGE_SIZE) * PAGE_SIZE + 1;

  const endPage = Math.min(startPage + PAGE_SIZE - 1, totalPages);

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <section className="px-4 py-5 sm:px-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ix-teal-pale rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-ix-teal" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-ix-dark">Clients</h1>
            <p className="text-sm text-ix-charcoal">
              {total} client{total !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        <ClientButton />
      </div>

      <div className="card-surface overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-ix-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <h2 className="text-lg font-medium text-ix-dark">All Clients</h2>
          <div className="w-full sm:w-auto">
            <Search />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full">
            <thead className="sticky top-0 z-10 border-b border-ix-border bg-ix-elevated">
              <tr className="text-left ui-label">
                <th className="px-4 py-3 sm:px-6 sm:py-4">Client</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Contact</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Invoices</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Total Billed</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Created</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4"></th>
              </tr>
            </thead>

            <tbody>
              {fetchedClients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-ix-charcoal"
                  >
                    No clients found.
                  </td>
                </tr>
              ) : (
                fetchedClients.map((client, i) => {
                  const initials = client.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={client.id}
                      className="border-b border-ix-border/50 transition-colors hover:bg-ix-elevated/60"
                    >
                      <td className="px-4 py-4 sm:px-6 sm:py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${
                              avatarPalette[i % avatarPalette.length]
                            }`}
                          >
                            {initials}
                          </div>

                          <div>
                            <p className="font-medium text-ix-dark">
                              {client.name}
                            </p>
                            <p className="text-sm text-ix-charcoal">
                              {client.company}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-ix-charcoal sm:px-6 sm:py-5">
                        {client.email}
                      </td>

                      <td className="px-4 py-4 text-ix-charcoal sm:px-6 sm:py-5">
                        —
                      </td>

                      <td className="px-4 py-4 text-ix-charcoal sm:px-6 sm:py-5">
                        —
                      </td>

                      <td className="px-4 py-4 text-ix-charcoal sm:px-6 sm:py-5">
                        {client.createdAt.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-4 text-right sm:px-6 sm:py-5">
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
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-ix-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-center text-sm text-ix-charcoal sm:text-left">
            {total} client{total !== 1 ? "s" : ""} total
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <Link
              href={{
                pathname: "/dashboard/clients",
                query: {
                  search,
                  page: Math.max(currentPage - 1, 1),
                },
              }}
              className={`flex h-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors sm:px-4 ${
                currentPage === 1
                  ? "pointer-events-none border-ix-border text-ix-muted/50"
                  : "border-ix-border text-ix-charcoal hover:bg-ix-elevated"
              }`}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Link>

            {visiblePages.map((p) => (
              <Link
                key={p}
                href={{
                  pathname: "/dashboard/clients",
                  query: {
                    search,
                    page: p,
                  },
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                  p === currentPage
                    ? "bg-ix-teal text-white"
                    : "border border-ix-border text-ix-charcoal hover:bg-ix-elevated"
                }`}
              >
                {p}
              </Link>
            ))}

            <Link
              href={{
                pathname: "/dashboard/clients",
                query: {
                  search,
                  page: Math.min(currentPage + 1, Math.max(totalPages, 1)),
                },
              }}
              className={`flex h-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors sm:px-4 ${
                currentPage === totalPages || totalPages === 0
                  ? "pointer-events-none border-ix-border text-ix-muted/50"
                  : "border-ix-border text-ix-charcoal hover:bg-ix-elevated"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="ml-0 h-4 w-4 sm:ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Client;