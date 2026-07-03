import SideBar from "@/components/dashboard/Sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-[72px] shrink-0 ml-4 items-center">
          <SideBar user={user?.user} />
        </aside>

        <main className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}