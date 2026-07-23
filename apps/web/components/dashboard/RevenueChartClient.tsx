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
  <Card className="rounded-[28px] border border-slate-200/60 bg-white p-5 shadow-sm sm:rounded-[34px] sm:px-8 sm:py-7">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Revenue Overview
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-[42px]">
          ${Math.round(totalRevenue).toLocaleString()}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-emerald-600">
            +12.4%
          </span>

          <span className="text-sm text-slate-400">
            compared with last month
          </span>
        </div>
      </div>

      <div className="self-start rounded-full bg-slate-100 p-1">
        <button className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-sm">
          Monthly
        </button>

        <button className="rounded-full px-4 py-2 text-xs font-medium text-slate-500 transition hover:text-slate-700">
          Yearly
        </button>
      </div>
    </div>

    <div className="mt-8 h-[260px] sm:h-[340px] lg:h-[410px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={revenue}
          margin={{
            top: 15,
            right: 5,
            left: -10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="revenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#3B82F6"
                stopOpacity={0.25}
              />

              <stop
                offset="100%"
                stopColor="#3B82F6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="#EEF2F7"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94A3B8",
              fontSize: 12,
              fontWeight: 500,
            }}
          />

          <YAxis hide />

          <Tooltip
            cursor={false}
            contentStyle={{
              border: "none",
              borderRadius: 18,
              boxShadow: "0 18px 40px rgba(15,23,42,.12)",
              padding: "12px 16px",
            }}
          />

          <Area
            type="natural"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={4}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{
              r: 7,
              fill: "#3B82F6",
              stroke: "#fff",
              strokeWidth: 4,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);
}