import SearchToggle from "@/components/shared/SearchToggle";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Eye, Plus } from "lucide-react";
import { headers } from "next/headers";
import { INVOICE_STATUS } from "@/app/generated/prisma";
import FilterToggle from "@/components/shared/FilterToggle";
import Link from "next/link";

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

  return (
    <section className="flex h-screen flex-col bg-[#F7F9FC] p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {total} invoice{total !== 1 ? "s" : ""} total
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-[#0F2A4A] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#16385f]">
          <Plus className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900">All Invoices</h2>
          <SearchToggle />
        </div>

        <FilterToggle />

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <table className="w-full">
            <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">SubTotal</th>
                <th className="px-6 py-4">Tax</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {fetchInvoice.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                fetchInvoice.map((invoice) => {
                  const config = statusConfig[invoice.status] ?? statusConfig.DRAFT;

                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-slate-50 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 font-medium text-slate-900">
                        #{invoice.id.slice(0, 8)}
                      </td>

                      <td className="px-6 py-5 text-slate-700">{invoice.client.name}</td>

                      <td className="px-6 py-5 font-semibold text-slate-900">
                        ₹{invoice.total.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        ₹{invoice.subTotal.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        ₹{invoice.tax.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {invoice.dueDate.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                          <span className={`text-sm font-medium ${config.text}`}>
                            {config.label}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`invoices/${invoice.id}`}
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

        <div className="flex items-center justify-between border-t border-slate-100 p-6">
          <p className="text-sm text-slate-500">{total} invoices total</p>

          <div className="flex gap-2">
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={{
                  pathname: "/dashboard/invoices",
                  query: { search, status, page: p },
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Invoice;