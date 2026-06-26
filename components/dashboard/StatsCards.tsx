import { Card } from "@/components/ui/card";
import { stats } from "./dashboard-data";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async  function StatsCards() {


      const user = await auth.api.getSession({
        headers : await headers()
      })

      const now = new Date()

      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getDate() + 1)
      
      
    

    const lastMonthPaidCount = await prisma.invoice.count({
        where : 
        {
        userId : user?.user.id, 
        paidAt : {
            gte : lastMonth,
            lte : now
        }
        }
    })

    const lastMonthINvoiceRevenue = await prisma.invoice.findMany({
        where :{
            userId : user?.user.id,
            paidAt :{
                gt : lastMonth,
                lt : nextMonth 
            },
        },
        select :{
            total : true
        }
    })


    const revenueCount = lastMonthINvoiceRevenue.reduce((item : any, acc) => {
        acc + item?.total
    }, 0)



      const overDueCount = await prisma.invoice.count({where : {userId : user?.user.id, status : "OVERDUE"}})

      

      const awaitingCount = await prisma.invoice.findMany({
        where :{
            userId : user?.user.id,
            status : "SENT"
        },
        select :{
            total : true
        }
      })

      const awaitingPaymentCount = awaitingCount.reduce((item : any,acc) => {
        acc + item?.total
      }, 0)




      console.log('last month paid count', lastMonthPaidCount);
      console.log('last month paid count', revenueCount);
      console.log('overduecount', overDueCount);
      console.log('awaiting payment count', awaitingPaymentCount);
      


  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="rounded-2xl border bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div className="rounded-xl border bg-muted p-3">
                <Icon className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-green-600">
                {stat.change}
              </span>

            </div>

            <div className="mt-8">

              <p className="text-sm text-muted-foreground">
                {stat.title}
              </p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight">
                {stat.value}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {stat.description}
              </p>

            </div>

          </Card>
        );
      })}
    </div>
  );
}