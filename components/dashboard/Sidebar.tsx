"use client";

import Link from "next/link";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/invoices", icon: FileText, label: "Invoices" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/payments", icon: CreditCard, label: "Payments" },
  { href: "/dashboard/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  user:
    | {
        name?: string;
        email?: string;
        image?: string | null;
      }
    | undefined;
}

export default function SideBar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={120}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3 px-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F2A4A] text-white shadow-sm">
            <Zap className="h-5 w-5 fill-current" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">InvoiceX</h2>
            <p className="text-xs text-slate-400">CRM</p>
          </div>
        </div>

        {/* Floating Dock */}
        <aside className="flex w-[72px] flex-1 flex-col justify-between rounded-[34px] border border-slate-200 bg-white py-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col items-center gap-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                        active
                          ? "bg-[#0F2A4A] text-white shadow-md"
                          : "text-slate-500 hover:bg-sky-50 hover:text-[#0F2A4A]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>

                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="overflow-hidden rounded-2xl ring-2 ring-transparent transition hover:ring-sky-200">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-11 w-11 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 font-semibold text-rose-600">
                      {user?.name?.slice(0, 1)}
                    </div>
                  )}
                </button>
              </TooltipTrigger>

              <TooltipContent side="right">
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </aside>
      </div>
    </TooltipProvider>
  );
}