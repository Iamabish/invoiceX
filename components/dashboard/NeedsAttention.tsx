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
    <Card className="rounded-[36px] border-0 bg-white p-7 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Needs Attention</h2>
        <p className="mt-1 text-sm text-slate-500">Items requiring your action</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl bg-slate-50 p-5 transition-all duration-200 hover:bg-slate-100"
            >
              <div className="flex items-start gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                  <Icon className="h-5 w-5 text-slate-500" />
                  <span className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${item.dot}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.subtitle}</p>

                  <Button
                    variant="ghost"
                    className="mt-4 h-auto rounded-full px-0 text-sm font-medium text-[#0F2A4A] hover:bg-transparent hover:text-sky-600"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
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