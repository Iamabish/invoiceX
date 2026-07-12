import { auth } from "@/lib/auth";
import {prisma} from "@invoicex/db"

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/app/utils/helper";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  Trash2,
  User,
  Building2,
  Phone,
  MapPin,
  ReceiptText,
} from "lucide-react";
import InvoiceDownloadButton from "@/components/shared/InvoiceDownloadButton";
import SendInvoiceClientButton from "@/components/shared/SendInvoiceClientButton";

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  PAID: { label: "Paid", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  SENT: { label: "Sent", dot: "bg-sky-500", text: "text-sky-700", bg: "bg-sky-50" },
  OVERDUE: { label: "Overdue", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  DRAFT: { label: "Draft", dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
};

function StatusPill({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.DRAFT;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${config.bg} ${config.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

const InvoiceDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  console.log('rendered', id);
  

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: {
      invoiceNumber: true,
      issueDate: true,
      dueDate: true,
      status: true,
      tax: true,
      total: true,
      subTotal: true,
      invoiceItems: {
        select: {
          description: true,
          quantity: true,
          unitPrice: true,
        },
      },
      client: {
        select: {
          name: true,
          email: true,
          phone: true,
          address: true,
          company: true,
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  return (
  <div className="mx-auto max-w-7xl space-y-6 bg-[#F7F9FC] px-4 py-5 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {invoice.invoiceNumber}
          </h1>

          <StatusPill status={invoice.status} />
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Review invoice details, client information and payment summary.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
        <InvoiceDownloadButton id={id} />

        <SendInvoiceClientButton invoiceId={id} />

        {invoice.status === "DRAFT" && (
          <Button
            variant="destructive"
            className="gap-2 rounded-2xl"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 xl:sticky xl:top-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50">
            <User className="h-5 w-5 text-sky-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Client Information
            </h2>

            <p className="text-sm text-slate-500">
              Billing recipient
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xl font-semibold text-slate-900">
              {invoice.client.name}
            </p>

            <p className="text-sm text-slate-500">
              {invoice.client.email}
            </p>
          </div>

          {invoice.client.company && (
            <div className="flex items-start gap-3 text-slate-700">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>{invoice.client.company}</span>
            </div>
          )}

          {invoice.client.phone && (
            <div className="flex items-start gap-3 text-slate-700">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>{invoice.client.phone}</span>
            </div>
          )}

          {invoice.client.address && (
            <div className="flex items-start gap-3 text-slate-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>{invoice.client.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 xl:sticky xl:top-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50">
            <ReceiptText className="h-5 w-5 text-sky-600" />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Invoice Details
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">
              Invoice Number
            </span>

            <span className="font-semibold text-right text-slate-900">
              {invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-4 w-4" />
              Issue Date
            </span>

            <span className="text-right text-slate-700">
              {formatDate(invoice.issueDate)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-4 w-4" />
              Due Date
            </span>

            <span className="text-right text-slate-700">
              {formatDate(invoice.dueDate)}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-slate-900">
                Current Status
              </span>

              <StatusPill status={invoice.status} />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
        <h2 className="text-lg font-semibold text-slate-900">
          Invoice Items
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-4 text-left sm:px-6">
                Description
              </th>

              <th className="px-4 py-4 text-center sm:px-6">
                Qty
              </th>

              <th className="px-4 py-4 text-right sm:px-6">
                Unit Price
              </th>

              <th className="px-4 py-4 text-right sm:px-6">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {invoice.invoiceItems.map((item, index) => {
              const amount = item.quantity * item.unitPrice;

              return (
                <tr
                  key={index}
                  className="border-b border-slate-50 hover:bg-slate-50"
                >
                  <td className="px-4 py-5 sm:px-6">
                    <p className="text-slate-700">
                      {item.description}
                    </p>
                  </td>

                  <td className="px-4 py-5 text-center text-slate-700 sm:px-6">
                    {item.quantity}
                  </td>

                  <td className="px-4 py-5 text-right text-slate-700 sm:px-6">
                    {formatCurrency(item.unitPrice)}
                  </td>

                  <td className="px-4 py-5 text-right font-semibold text-slate-900 sm:px-6">
                    {formatCurrency(amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    <div className="flex justify-center lg:justify-end">
      <div className="w-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:max-w-md sm:p-7">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Payment Summary
        </h2>

        <div className="space-y-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-medium text-slate-900">
              {formatCurrency(invoice.subTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Tax
            </span>

            <span className="font-medium text-slate-900">
              {formatCurrency(invoice.tax)}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">
                Total
              </span>

              <span className="text-2xl font-bold text-[#0F2A4A]">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default InvoiceDetailPage;