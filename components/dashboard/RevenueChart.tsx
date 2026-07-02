

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const revenue = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5200 },
  { month: "Mar", revenue: 4900 },
  { month: "Apr", revenue: 6800 },
  { month: "May", revenue: 7400 },
  { month: "Jun", revenue: 8300 },
  { month: "Jul", revenue: 7800 },
];


export default async function RevenueChart() {


  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const now = new Date();


  return (
    <Card className="rounded-2xl p-6">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold">
            Revenue Overview
          </h2>

          <p className="text-sm text-muted-foreground">
            Monthly revenue performance
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold">$18,240</p>
          <p className="text-sm font-medium text-green-600">
            +12.4%
          </p>
        </div>

      </div>

      <div className="h-[360px]">

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenue}>

            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">

                <stop
                  offset="5%"
                  stopColor="currentColor"
                  stopOpacity={0.25}
                />

                <stop
                  offset="95%"
                  stopColor="currentColor"
                  stopOpacity={0}
                />

              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              strokeWidth={3}
              fill="url(#fillRevenue)"
            />

          </AreaChart>
        </ResponsiveContainer>

      </div>

    </Card>
  );
}