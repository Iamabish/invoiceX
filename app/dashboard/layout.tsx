import SideBar from "@/components/dashboard/Sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

       const user = await auth.api.getSession({
        headers : await headers()
    })

    console.log('user', user);


  return (

    
    <div className="flex min-h-screen">
      <SideBar user={user?.user}/>

      <main className="flex-1 overflow-y-auto bg-zinc-50">
        {children}
      </main>
    </div>
  );
}