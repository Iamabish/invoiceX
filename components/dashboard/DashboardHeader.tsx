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
    <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl xl:text-5xl">
          Welcome Back,
          <span className="block lg:inline">
            {" "}
            {user?.user.name}
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
          Here's what's happening with your invoices today.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-shrink-0">
        <div className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 shadow-sm">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <span>{today}</span>
        </div>

        <Button className="h-12 rounded-2xl bg-[#0F2A4A] px-6 text-white shadow-sm transition hover:bg-[#16385f]">
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>
    </header>
  );
}