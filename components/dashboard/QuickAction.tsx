import {
  Plus,
  UserPlus,
  Mail,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const actions = [
  {
    icon: Plus,
    title: "New Invoice",
    description: "Create an invoice",
  },
  {
    icon: UserPlus,
    title: "Add Client",
    description: "Create a client",
  },
  {
    icon: Mail,
    title: "Send Reminder",
    description: "Notify customers",
  },
  {
    icon: Download,
    title: "Export Report",
    description: "Download analytics",
  },
];

export default function QuickActions() {
  return (
    <Card className="rounded-2xl p-6">

      <div className="mb-6">

        <h2 className="text-lg font-semibold">
          Quick Actions
        </h2>

        <p className="text-sm text-muted-foreground">
          Common tasks
        </p>

      </div>

      <div className="space-y-3">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto w-full justify-start rounded-xl p-4"
            >
              <Icon className="mr-4 h-5 w-5" />

              <div className="text-left">

                <div className="font-medium">
                  {action.title}
                </div>

                <div className="text-xs text-muted-foreground">
                  {action.description}
                </div>

              </div>

            </Button>
          );
        })}

      </div>

    </Card>
  );
}