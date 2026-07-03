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
    <Card className="rounded-[36px] border-0 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Recent Invoices</h2>
          <p className="mt-1 text-sm text-slate-500">Latest customer invoices</p>
        </div>

        <Button variant="ghost" className="rounded-full px-5 text-slate-500 hover:bg-slate-100">
          View all
        </Button>
      </div>

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
            className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] items-center rounded-3xl bg-slate-50 px-5 py-5 transition-all duration-200 hover:bg-slate-100"
          >
            <div>
              <h3 className="font-semibold text-slate-900">{invoice.client}</h3>
              <p className="mt-1 text-sm text-slate-400">Due {invoice.due}</p>
            </div>

            <p className="font-medium text-slate-700">{invoice.id}</p>
            <p className="font-semibold text-slate-900">{invoice.amount}</p>

            <StatusDot status={invoice.status} />

            <Button size="icon" variant="ghost" className="rounded-full">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}