import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import NeedsAttention from "@/components/dashboard/NeedsAttention";
import RecentInvoices from "@/components/dashboard/RecentInvoice";
import TopClients from "@/components/dashboard/TopClients";
import QuickActions from "@/components/dashboard/QuickAction";

export default async function Dashboard() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">

      <div className="mx-auto max-w-[1700px] px-10 py-8">

        <DashboardHeader />
        {/* Dashboard */}
        <section className="mt-8 grid grid-cols-[320px_1fr_320px] gap-6">

          {/* Left KPI Column */}
          <aside className="sticky top-8">
            <StatsCards />
          </aside>

          {/* Main Content */}
          <section className="space-y-6">

            <RevenueChart />

            <RecentInvoices />

          </section>

          {/* Right Sidebar */}
          <aside className="space-y-6">

            <NeedsAttention />

            <TopClients />

            <QuickActions />

          </aside>

        </section>

      </div>

    </main>
  );
}