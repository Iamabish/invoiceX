import {
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const invoices = [
  {
    id: "INV-1024",
    client: "Acme Inc.",
    amount: "$2,450",
    due: "Jun 28",
    status: "PAID",
  },
  {
    id: "INV-1025",
    client: "Orbit Labs",
    amount: "$980",
    due: "Today",
    status: "SENT",
  },
  {
    id: "INV-1026",
    client: "Nova Studio",
    amount: "$1,280",
    due: "Jun 18",
    status: "OVERDUE",
  },
  {
    id: "INV-1027",
    client: "Pixel Agency",
    amount: "$620",
    due: "Jul 3",
    status: "DRAFT",
  },
];

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PAID":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Paid
        </Badge>
      );

    case "OVERDUE":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Overdue
        </Badge>
      );

    case "SENT":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Clock3 className="mr-1 h-3 w-3" />
          Sent
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary">
          Draft
        </Badge>
      );
  }
}

export default function RecentInvoices() {
  return (
    <Card className="rounded-2xl p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold">
            Recent Invoices
          </h2>

          <p className="text-sm text-muted-foreground">
            Latest activity across your invoices
          </p>
        </div>

        <Button variant="ghost">
          View All
        </Button>

      </div>

      <div className="overflow-hidden rounded-xl border">

        <table className="w-full">

          <thead className="bg-muted/50">

            <tr className="text-left text-sm">

              <th className="p-4 font-medium">Invoice</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Due</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4"></th>

            </tr>

          </thead>

          <tbody>

            {invoices.map((invoice) => (

              <tr
                key={invoice.id}
                className="border-t transition hover:bg-muted/40"
              >

                <td className="p-4 font-medium">
                  {invoice.id}
                </td>

                <td className="p-4">
                  {invoice.client}
                </td>

                <td className="p-4 font-semibold">
                  {invoice.amount}
                </td>

                <td className="p-4 text-muted-foreground">
                  {invoice.due}
                </td>

                <td className="p-4">
                  <StatusBadge status={invoice.status} />
                </td>

                <td className="p-4 text-right">

                  <Button
                    variant="ghost"
                    size="icon"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Card>
  );
}