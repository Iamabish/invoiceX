import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AlertBanner from "@/components/dashboard/AlertBanner";
import StatsCards from "@/components/dashboard/StatsCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import NeedsAttention from "@/components/dashboard/NeedsAttention";
import RecentInvoices from "@/components/dashboard/RecentInvoice";
import TopClients from "@/components/dashboard/TopClients";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickAction";

export default async function Dashboard() {
  return (
    <div className="space-y-8">

      <DashboardHeader />

      <AlertBanner />

      <StatsCards />

      {/* Main Section */}
      <div className="grid gap-6 xl:grid-cols-[2fr_360px]">

        <RevenueChart />

        <NeedsAttention />

      </div>

      {/* Second Section */}
      <div className="grid gap-6 xl:grid-cols-[2fr_360px]">

        <RecentInvoices />

        <TopClients />

      </div>

      {/* Third Section */}
      <div className="grid gap-6 xl:grid-cols-[2fr_360px]">

        <RecentActivity />

        <QuickActions />

      </div>

    </div>
  );
}