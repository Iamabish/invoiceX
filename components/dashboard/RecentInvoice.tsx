// RecentInvoices.tsx
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const invoices = [
  { id: "INV-1024", client: "Acme Inc.", amount: "$2,450", due: "Jun 28", status: "PAID" },
  { id: "INV-1025", client: "Orbit Labs", amount: "$980", due: "Today", status: "SENT" },
  { id: "INV-1026", client: "Nova Studio", amount: "$1,280", due: "Jun 18", status: "OVERDUE" },
  { id: "INV-1027", client: "Pixel Agency", amount: "$620", due: "Jul 3", status: "DRAFT" },
];

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  PAID: { label: "Paid", dot: "bg-emerald-500", text: "text-emerald-700" },
  OVERDUE: { label: "Overdue", dot: "bg-red-500", text: "text-red-700" },
  SENT: { label: "Sent", dot: "bg-sky-500", text: "text-sky-700" },
  DRAFT: { label: "Draft", dot: "bg-slate-400", text: "text-slate-600" },
};

function StatusDot({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.DRAFT;

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
    </div>
  );
}

export default function RecentInvoices() {
 return (
  <Card className="rounded-[28px] border-0 bg-white p-5 shadow-sm sm:rounded-[36px] sm:p-8">
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Recent Invoices
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest customer invoices
        </p>
      </div>

      <Button
        variant="ghost"
        className="self-start rounded-full px-5 text-slate-500 hover:bg-slate-100 sm:self-auto"
      >
        View all
      </Button>
    </div>

    <div className="hidden lg:block">
      <div className="mb-3 grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] px-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <p>Client</p>
        <p>Invoice</p>
        <p>Amount</p>
        <p>Status</p>
        <p></p>
      </div>

      <div className="space-y-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] items-center rounded-3xl bg-slate-50 px-5 py-5 transition hover:bg-slate-100"
          >
            <div>
              <h3 className="font-semibold text-slate-900">
                {invoice.client}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Due {invoice.due}
              </p>
            </div>

            <p className="font-medium text-slate-700">
              {invoice.id}
            </p>

            <p className="font-semibold text-slate-900">
              {invoice.amount}
            </p>

            <StatusDot status={invoice.status} />

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-4 lg:hidden">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                {invoice.client}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {invoice.id}
              </p>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Amount
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {invoice.amount}
              </p>
            </div>

            <StatusDot status={invoice.status} />
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Due Date
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {invoice.due}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);
}