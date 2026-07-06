import SearchToggle from "@/components/shared/SearchToggle";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Eye, Plus } from "lucide-react";
import { headers } from "next/headers";
import { INVOICE_STATUS } from "@/app/generated/prisma";
import FilterToggle from "@/components/shared/FilterToggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NewInvoiceClientButton from "@/components/shared/NewInvoiceClientButton";

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  PAID: { label: "Paid", dot: "bg-emerald-500", text: "text-emerald-700" },
  SENT: { label: "Sent", dot: "bg-sky-500", text: "text-sky-700" },
  DRAFT: { label: "Draft", dot: "bg-amber-500", text: "text-amber-700" },
  OVERDUE: { label: "Overdue", dot: "bg-red-500", text: "text-red-700" },
};

type Props = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    status?: string;
  }>;
};

const Invoice = async ({ searchParams }: Props) => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const { search, page, status } = await searchParams;

  const limit = 10;
  const currPage = Number(page) || 1;
  const skip = (currPage - 1) * limit;

  const where: any = {
    userId: user?.user.id,
  };

  if (search) {
    where.OR = [
      {
        client: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        client: {
          company: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  if (status && status !== "All") {
    where.status = status.toUpperCase() as INVOICE_STATUS;
  }

  const fetchInvoice = await prisma.invoice.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      status: true,
      subTotal: true,
      tax: true,
      total: true,
      dueDate: true,
      createdAt: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });

  const total = await prisma.invoice.count({
    where,
  });

  const totalPages = Math.ceil(total / limit);

  const PAGE_SIZE = 5;

  const startPage =
    Math.floor((currPage - 1) / PAGE_SIZE) * PAGE_SIZE + 1;

  const endPage = Math.min(
    startPage + PAGE_SIZE - 1,
    totalPages
  );

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
  <section className="min-h-screen bg-[#F7F9FC] px-4 py-5 sm:px-6 lg:p-8">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Invoices
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {total} invoice{total !== 1 ? "s" : ""} total
        </p>
      </div>

     <NewInvoiceClientButton />
    </div>

    <div className="flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm sm:rounded-[30px]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          All Invoices
        </h2>

        <SearchToggle />
      </div>

      <FilterToggle />

      <div className="overflow-x-auto">
        <table className="min-w-[950px] w-full">
          <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3 sm:px-6 sm:py-4">Invoice</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Client</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Total</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">SubTotal</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Tax</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Due Date</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Status</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4"></th>
            </tr>
          </thead>

          <tbody>
            {fetchInvoice.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              fetchInvoice.map((invoice) => {
                const config =
                  statusConfig[invoice.status] ?? statusConfig.DRAFT;

                return (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-50 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-900 sm:px-6 sm:py-5">
                      #{invoice.id.slice(0, 8)}
                    </td>

                    <td className="px-4 py-4 text-slate-700 sm:px-6 sm:py-5">
                      {invoice.client.name}
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-900 sm:px-6 sm:py-5">
                      ₹{invoice.total.toLocaleString()}
                    </td>

                    <td className="px-4 py-4 text-slate-700 sm:px-6 sm:py-5">
                      ₹{invoice.subTotal.toLocaleString()}
                    </td>

                    <td className="px-4 py-4 text-slate-700 sm:px-6 sm:py-5">
                      ₹{invoice.tax.toLocaleString()}
                    </td>

                    <td className="px-4 py-4 text-slate-600 sm:px-6 sm:py-5">
                      {invoice.dueDate.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-4 sm:px-6 sm:py-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${config.dot}`}
                        />

                        <span
                          className={`text-sm font-medium ${config.text}`}
                        >
                          {config.label}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right sm:px-6 sm:py-5">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-[#0F2A4A]"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-sm text-slate-500">
          {total} invoices total
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={{
              pathname: "/dashboard/invoices",
              query: {
                search,
                status,
                page: Math.max(currPage - 1, 1),
              },
            }}
            className={`flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition ${
              currPage === 1
                ? "pointer-events-none border-slate-200 text-slate-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Previous
          </Link>

          {visiblePages.map((p) => (
            <Link
              key={p}
              href={{
                pathname: "/dashboard/invoices",
                query: {
                  search,
                  status,
                  page: p,
                },
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition ${
                p === currPage
                  ? "bg-[#0F2A4A] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={{
              pathname: "/dashboard/invoices",
              query: {
                search,
                status,
                page: Math.min(currPage + 1, totalPages),
              },
            }}
            className={`flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition ${
              currPage === totalPages
                ? "pointer-events-none border-slate-200 text-slate-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  </section>
);
};

export default Invoice;