"use client";

import Link from "next/link";
import {
  FileText,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
  LogOut,
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

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <TooltipProvider delayDuration={100}>
      <aside className="fixed left-4 top-1/2 z-50 hidden -translate-y-1/2 lg:flex flex-col items-center">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F2A4A] shadow-lg"
        >
          <Zap className="h-5 w-5 fill-current text-white" />
        </Link>

        {/* Navigation Dock */}
        <nav className="flex flex-col items-center gap-1 rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
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
                        ? "bg-[#0F2A4A] text-white shadow-sm"
                        : "text-slate-500 hover:bg-sky-50 hover:text-[#0F2A4A]"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                </TooltipTrigger>

                <TooltipContent
                  side="right"
                  className="bg-[#0F2A4A] px-3 py-1.5 text-xs text-white"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}

          <div className="my-1 h-px w-8 bg-slate-200" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-500">
                <LogOut className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </TooltipTrigger>

            <TooltipContent
              side="right"
              className="bg-[#0F2A4A] px-3 py-1.5 text-xs text-white"
            >
              Log Out
            </TooltipContent>
          </Tooltip>
        </nav>

        {/* User Avatar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="mt-6 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-sky-100 text-xs font-semibold text-slate-800 shadow-sm transition-shadow hover:shadow-md">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "User"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </button>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            className="bg-[#0F2A4A] px-3 py-1.5 text-white"
          >
            <div className="font-medium">{user?.name}</div>
            <div className="text-[10px] text-slate-300">{user?.email}</div>
          </TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
}