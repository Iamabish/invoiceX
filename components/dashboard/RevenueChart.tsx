import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import React from 'react'
import RevenueChartClient from './RevenueChartClient'

const RevenueChart = async () => {

  console.log('i am rendered');
  

  const user = await auth.api.getSession({
    headers : await headers()
  })

  const now = new Date()

  const startOfCurrYear = new Date(now.getFullYear(), 0, 1)

  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1)

  
  console.log('start', startOfCurrYear);
  console.log('end', startOfLastYear);
  
  

  const totalInvoice = await prisma.invoice.findMany({
    where : {
      userId : user?.user.id,
      status :"PAID",
      paidAt : {
        gte : startOfLastYear,
        lt : startOfLastYear
      }
    },
    select : {
      total : true,
      paidAt : true
    }
  })


  console.log(totalInvoice);


  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];


  const monthlyRevenue = Object.fromEntries(monthNames.map((month)=> [month, 0])) as Record<string, number>
  
  for(const invoice of totalInvoice) {

    if(!invoice.paidAt) continue

    const monthIndex = invoice.paidAt.getMonth()

    const month = monthNames[monthIndex]

    monthlyRevenue[month] += invoice.total


  }

  const revenue = Object.entries(monthlyRevenue).map((
    [month, revenue]
  ) => ({
    month,
    revenue
  }))

  console.log(revenue);
  


  

  return (

    <div>

      <RevenueChartClient revenue={revenue}/>
    </div>
  )
}

export default RevenueChart