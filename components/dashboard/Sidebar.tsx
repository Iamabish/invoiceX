'use client'
import Link from "next/link";
import {
  BarChart3,
  CreditCard,
  FileText,
  HelpCircle,
  Keyboard,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  {
    title: "",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        active: true,
      },
      {
        name: "Invoices",
        href: "/dashboard/invoices",
        icon: FileText,
        badge: "3",
      },
      {
        name: "Clients",
        href: "/dashboard/clients",
        icon: Users,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        name: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
      },
      {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];


interface SidebarProps {
  user: {
    name?: string;
    email?: string;
    image?: string | null;
  } | undefined;
}

const SideBar =  ({user} : SidebarProps) => {

    console.log('user at sidebar', user);
    

    const pathName = usePathname()


  return (
    <aside className="flex h-screen w-72 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white shadow-sm">
            <Zap className="h-5 w-5 fill-current" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              InvoiceX
            </h2>

            <p className="text-xs text-zinc-500">
              Professional invoicing
            </p>
          </div>
        </Link>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {navigation.map((section, index) => (
          <div key={index} className="mb-8">
            {section.title && (
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                {section.title}
              </p>
            )}

            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                      pathName == item.href
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </div>

                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          item.active
                            ? "bg-white/20 text-white"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 p-5">
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-zinc-50 p-3">
          <div className="flex h-12 w-12 items-center   justify-center rounded-full bg-black  font-semibold text-white">

            {user && user.image ? (
                <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                />
                ) : (
                <span className="text-xl font-semibold leading-none">
                    {user && user?.name?.slice(0, 2)}
                </span>
                )}
          </div>

          <div className="min-w-0">
            <h4 className="truncate font-medium text-zinc-900">
              {user?.name}
            </h4>

            <p className="text-sm text-zinc-500">
              Pro Plan
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button className="rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900">
            <HelpCircle className="h-5 w-5" />
          </button>

          <button className="rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900">
            <Keyboard className="h-5 w-5" />
          </button>

          <button className="rounded-xl p-2.5 text-zinc-500 transition hover:bg-red-50 hover:text-red-600">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;