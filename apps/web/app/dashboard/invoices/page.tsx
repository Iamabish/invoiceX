
import { auth } from "@/lib/auth";
import {prisma} from "@invoicex/db"
import { Eye, FileText } from "lucide-react";
import { headers } from "next/headers";
import { INVOICE_STATUS } from "@/app/generated/prisma";
import FilterToggle from "@/components/shared/FilterToggle";
import Link from "next/link";
import NewInvoiceClientButton from "@/components/shared/NewInvoiceClientButton";
import Search from "@/components/shared/Search";

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  PAID: { label: "Paid", dot: "bg-ix-status-paid", text: "text-ix-status-paid" },
  SENT: { label: "Sent", dot: "bg-ix-status-sent", text: "text-ix-status-sent" },
  DRAFT: { label: "Draft", dot: "bg-ix-status-draft", text: "text-ix-status-draft" },
  OVERDUE: { label: "Overdue", dot: "bg-ix-status-overdue", text: "text-ix-status-overdue" },
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

  const limit = 5;
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
    <section className="  px-4 py-5 sm:px-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ix-teal-pale rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-ix-teal" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-ix-dark">Invoices</h1>
            <p className="text-sm text-ix-charcoal">
              {total} invoice{total !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        <NewInvoiceClientButton />
      </div>

      <div className="card-surface overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-ix-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:w-auto"><Search /></div>
        <FilterToggle />

      </div>


        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full">
            <thead className="sticky top-0 z-10 border-b border-ix-border bg-ix-elevated">
              <tr className="text-left ui-label">
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
                    className="px-6 py-10 text-center text-ix-charcoal"
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
                      className="border-b border-ix-border/50 transition-colors hover:bg-ix-elevated/60"
                    >
                      <td className="px-4 py-4 font-medium text-ix-dark sm:px-6 sm:py-5">
                        #{invoice.id.slice(0, 8)}
                      </td>

                      <td className="px-4 py-4 text-ix-charcoal sm:px-6 sm:py-5">
                        {invoice.client.name}
                      </td>

                      <td className="px-4 py-4 font-semibold text-ix-dark sm:px-6 sm:py-5">
                        ₹{invoice.total.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-ix-charcoal sm:px-6 sm:py-5">
                        ₹{invoice.subTotal.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-ix-charcoal sm:px-6 sm:py-5">
                        ₹{invoice.tax.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-ix-charcoal sm:px-6 sm:py-5">
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
                          className="inline-flex items-center gap-2 rounded-xl border border-ix-border px-3 py-2 text-sm text-ix-charcoal transition-colors hover:border-ix-teal-light hover:bg-ix-teal-pale hover:text-ix-teal"
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

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-ix-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm text-ix-charcoal">{total} invoices total</p>

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
              className={`flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition-colors ${
                currPage === 1
                  ? "pointer-events-none border-ix-border text-ix-muted/50"
                  : "border-ix-border text-ix-charcoal hover:bg-ix-elevated"
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
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                  p === currPage
                    ? "bg-ix-teal text-white"
                    : "border border-ix-border text-ix-charcoal hover:bg-ix-elevated"
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
              className={`flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition-colors ${
                currPage === totalPages
                  ? "pointer-events-none border-ix-border text-ix-muted/50"
                  : "border-ix-border text-ix-charcoal hover:bg-ix-elevated"
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