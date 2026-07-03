// DashboardHeader.tsx
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { CalendarDays, Plus } from "lucide-react";
import { headers } from "next/headers";

export default async function DashboardHeader() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <header className="flex items-start justify-between">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Welcome Back, {user?.user.name}
        </h1>

        <p className="mt-3 text-base text-slate-500">
          Here&apos;s what&apos;s happening with your invoices today.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 shadow-sm">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {today}
        </div>

        <Button className="h-12 rounded-2xl bg-[#0F2A4A] px-6 text-white shadow-sm hover:bg-[#16385f]">
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>
    </header>
  );
}