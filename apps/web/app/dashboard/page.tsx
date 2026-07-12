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
      <div className="mx-auto max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8 xl:px-10 xl:py-8">
        <DashboardHeader />

        <section
          className="
            mt-6
            grid
            gap-6

            grid-cols-1

            


            xl:grid-cols-4
            2xl:grid-cols-[320px_1fr_320px]
          "
        >
        <aside className="flex flex-col gap-6 xl:col-span-1 2xl:col-span-1">
  <StatsCards />

    <div className="xl:mt-10 2xl:mt-0">
      <QuickActions />
    </div>
    </aside>

    <section className="space-y-6 xl:col-span-2 2xl:col-span-1">
      <RevenueChart />
      <RecentInvoices />
    </section>

    <aside className="space-y-6 xl:col-span-1 2xl:col-span-1">
          <NeedsAttention />
          <TopClients />
    </aside>
      </section>
              
      </div>
    </main>
  );
}