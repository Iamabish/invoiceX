import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TriangleAlert,
  FileClock,
  Eye,
} from "lucide-react";

const items = [
  {
    title: "Orbit Labs",
    subtitle: "INV-1023 • 8 days overdue",
    icon: TriangleAlert,
    color: "text-red-500",
  },
  {
    title: "Acme Inc",
    subtitle: "Draft awaiting approval",
    icon: FileClock,
    color: "text-amber-500",
  },
  {
    title: "Nova Studio",
    subtitle: "Viewed but unpaid",
    icon: Eye,
    color: "text-blue-500",
  },
];

export default function NeedsAttention() {
  return (
    <Card className="rounded-2xl p-6">

      <div className="mb-6">

        <h2 className="text-lg font-semibold">
          Needs Attention
        </h2>

        <p className="text-sm text-muted-foreground">
          Recent items requiring action.
        </p>

      </div>

      <div className="space-y-4">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border p-4 transition hover:bg-muted/50"
            >
              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-muted p-2">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>

                <div className="flex-1">

                  <h4 className="font-medium">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>

                  <Button
                    variant="link"
                    className="mt-2 h-auto p-0"
                  >
                    View →
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