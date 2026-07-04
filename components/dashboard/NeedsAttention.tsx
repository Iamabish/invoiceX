// NeedsAttention.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TriangleAlert, FileClock, Eye, ArrowRight } from "lucide-react";

const items = [
  {
    title: "Orbit Labs",
    subtitle: "Invoice INV-1023 • 8 days overdue",
    icon: TriangleAlert,
    dot: "bg-red-500",
  },
  {
    title: "Acme Inc",
    subtitle: "Draft invoice awaiting approval",
    icon: FileClock,
    dot: "bg-amber-500",
  },
  {
    title: "Nova Studio",
    subtitle: "Invoice viewed but not paid",
    icon: Eye,
    dot: "bg-sky-500",
  },
];

export default function NeedsAttention() {
return (
  <Card className="rounded-[28px] border-0 bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-6">
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Needs Attention
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Recent items requiring action.
      </p>
    </div>

    <div className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <Icon className="h-5 w-5 text-slate-700" />

                <span
                  className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ${item.dot}`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate font-semibold text-slate-900">
                  {item.title}
                </h4>

                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {item.subtitle}
                </p>

                <Button
                  variant="ghost"
                  className="mt-3 h-9 rounded-xl px-0 text-sky-600 hover:bg-transparent hover:text-sky-700"
                >
                  View
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);
}