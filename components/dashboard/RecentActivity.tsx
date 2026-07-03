import {
  CheckCircle2,
  Mail,
  Eye,
  AlertTriangle,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const activity = [
  {
    title: "Invoice Paid",
    description: "Acme Inc. • INV-1024",
    time: "2m ago",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
  {
    title: "Reminder Sent",
    description: "Orbit Labs",
    time: "24m ago",
    icon: Mail,
    bg: "bg-sky-50",
    color: "text-sky-600",
  },
  {
    title: "Invoice Viewed",
    description: "Nova Studio",
    time: "1h ago",
    icon: Eye,
    bg: "bg-violet-50",
    color: "text-violet-600",
  },
  {
    title: "Payment Overdue",
    description: "Pixel Agency",
    time: "Yesterday",
    icon: AlertTriangle,
    bg: "bg-red-50",
    color: "text-red-600",
  },
];

export default function RecentActivity() {
  return (
    <Card className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">

      <div className="mb-7 flex items-center justify-between">

        <div>

          <h3 className="text-[19px] font-semibold text-slate-900">
            Recent Activity
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Latest invoice events
          </p>

        </div>

        <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          View all
        </button>

      </div>

      <div className="space-y-3">

        {activity.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/40"
            >

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>

              <div className="min-w-0 flex-1">

                <h4 className="truncate text-[15px] font-semibold text-slate-900">
                  {item.title}
                </h4>

                <p className="mt-1 truncate text-sm text-slate-500">
                  {item.description}
                </p>

              </div>

              <span className="whitespace-nowrap text-xs font-medium text-slate-400">
                {item.time}
              </span>

            </div>
          );
        })}

      </div>

    </Card>
  );
}