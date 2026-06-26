import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Plus } from "lucide-react";
import { headers } from "next/headers";

export default async function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const user = await auth.api.getSession({
    headers : await headers()
  })

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Good morning, {user?.user.name} 👋
        </h1>

        <p className="mt-2 text-muted-foreground">
          {today}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          You have
          <span className="font-semibold text-red-600"> 2 overdue invoices </span>
          and
          <span className="font-semibold text-black"> $4,380 </span>
          outstanding.
        </p>
      </div>

      <div className="flex gap-3">

        <Button
          variant="outline"
          className="rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>

        <Button className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>

      </div>
    </div>
  );
}