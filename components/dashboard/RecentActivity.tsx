import {
  CheckCircle2,
  Mail,
  Eye,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const activity = [
  {
    title: "Invoice INV-1024 paid",
    description: "Acme Inc. completed payment",
    time: "2 min ago",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  {
    title: "Reminder email sent",
    description: "Orbit Labs",
    time: "24 min ago",
    icon: Mail,
    color: "text-blue-600",
  },
  {
    title: "Invoice viewed",
    description: "Nova Studio opened invoice",
    time: "1 hour ago",
    icon: Eye,
    color: "text-purple-600",
  },
  {
    title: "Invoice overdue",
    description: "Pixel Agency",
    time: "Yesterday",
    icon: AlertTriangle,
    color: "text-red-600",
  },
];

export default function RecentActivity() {
  return (
    <Card className="rounded-2xl p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <p className="text-sm text-muted-foreground">
            Everything happening across your invoices.
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {activity.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-xl border p-4 transition hover:bg-muted/40"
            >
              <div className="rounded-xl bg-muted p-3">
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="font-medium">
                      {item.title}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>

                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />

                  </div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </Card>
  );
}