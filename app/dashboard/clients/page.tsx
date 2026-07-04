import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import SearchToggle from "@/components/shared/SearchToggle";
import ClientButton from "@/components/shared/ClientButton";
import ClientActions from "@/components/shared/ClientAction";

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
  const limit = 10;
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

    const startPage =
      Math.floor((currentPage - 1) / PAGE_SIZE) * PAGE_SIZE + 1;

    const endPage = Math.min(
      startPage + PAGE_SIZE - 1,
      totalPages
    );

    const visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
 return (
  <section className="flex h-screen flex-col bg-[#F7F9FC] px-4 py-5 sm:px-6 lg:p-8">
    {/* Header */}
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Clients
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {total} client{total !== 1 ? "s" : ""} total
        </p>
      </div>

      <ClientButton />
    </div>

    {/* Card */}
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] sm:rounded-[30px] border border-slate-200 bg-white shadow-sm">
      {/* Top */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          All Clients
        </h2>

        <SearchToggle />
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto scrollbar-hide">
        <table className="min-w-[850px] w-full">
          <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Invoices</th>
              <th className="px-6 py-4">Total Billed</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {fetchedClients.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-500"
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
                    className="border-b border-slate-50 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${
                            avatarPalette[i % avatarPalette.length]
                          }`}
                        >
                          {initials}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {client.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {client.company}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {client.email}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      —
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      —
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {client.createdAt.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-5 text-right">
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

      {/* Pagination */}
      <div className="flex flex-col gap-4 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-center text-sm text-slate-500 sm:text-left">
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
            className={`flex h-10 items-center justify-center rounded-xl border px-3 sm:px-4 text-sm font-medium transition ${
              currentPage === 1
                ? "pointer-events-none border-slate-200 text-slate-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-100"
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
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition ${
                p === currentPage
                  ? "bg-[#0F2A4A] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-100"
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
            className={`flex h-10 items-center justify-center rounded-xl border px-3 sm:px-4 text-sm font-medium transition ${
              currentPage === totalPages || totalPages === 0
                ? "pointer-events-none border-slate-200 text-slate-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="ml-0 sm:ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);
};

export default Client;