// QuickActions.tsx
import { Plus, UserPlus, Mail, Download, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const actions = [
  { icon: Plus, title: "New Invoice", description: "Create invoice" },
  { icon: UserPlus, title: "Add Client", description: "Create client" },
  { icon: Mail, title: "Send Reminder", description: "Notify customer" },
  { icon: Download, title: "Export Report", description: "Download CSV" },
];

export default function QuickActions() {
  return (
    <Card className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-7">
        <h3 className="text-[19px] font-semibold text-slate-900">Quick Actions</h3>
        <p className="mt-1 text-sm text-slate-500">Frequently used actions</p>
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 transition-all duration-200 hover:border-sky-200 hover:bg-sky-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-sky-100">
                  <Icon className="h-5 w-5 text-slate-600 group-hover:text-[#0F2A4A]" />
                </div>

                <div className="text-left">
                  <h4 className="text-sm font-semibold text-slate-900">{action.title}</h4>
                  <p className="mt-1 text-xs text-slate-500">{action.description}</p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F2A4A]" />
            </button>
          );
        })}
      </div>
    </Card>
  );
}