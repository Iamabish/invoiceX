// RevenueChartClient.tsx
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface RevenueChartClientProps {
  revenue: { month: string; revenue: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">
        ${Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueChartClient({ revenue }: RevenueChartClientProps) {
  const totalRevenue = revenue.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <Card className="rounded-[34px] border border-slate-200/60 bg-white px-9 pt-8 pb-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[15px] font-medium text-slate-500">Revenue Overview</p>

          <h2 className="mt-2 text-[48px] font-bold tracking-tight leading-none text-slate-900">
            ${Math.round(totalRevenue).toLocaleString()}
          </h2>

          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              12.4%
            </span>
            <span className="text-sm text-slate-400">compared with last month</span>
          </div>
        </div>

        <div className="flex rounded-full bg-slate-100 p-1.5">
          <button className="rounded-full bg-[#0F2A4A] px-5 py-2 text-sm font-semibold text-white shadow-sm transition">
            Monthly
          </button>
          <button className="rounded-full px-5 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-700">
            Yearly
          </button>
        </div>
      </div>

      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenue} margin={{ top: 0, right: 18, left: -28, bottom: 8 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F2A4A" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#0F2A4A" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} horizontal stroke="#EAEFF5" strokeDasharray="5 5" />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 13, fontWeight: 500 }}
            />

            <YAxis hide />

            <Tooltip cursor={false} content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0F2A4A"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 6, fill: "#0F2A4A", stroke: "#fff", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}