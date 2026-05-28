"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS } from "@/lib/constants/chartColors";

interface Props {
  data: Array<{ date: string; subscriptions: number; cancellations: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function RetentionAnalytics({ data, isLoading, isError }: Props) {
  const monthlyData = data?.filter((_, i) => i % 3 === 0).slice(-12).map((d) => ({
    date: d.date,
    retention: d.subscriptions > 0 ? parseFloat((100 - (d.cancellations / d.subscriptions) * 100).toFixed(1)) : 100,
  })) ?? [];

  return (
    <ChartWrapper
      title="Retention Analytics"
      description="Monthly retention rate trend"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!monthlyData.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} unit="%" domain={[80, 100]} />
          <Tooltip formatter={(v: unknown) => [`${v}%`, "Retention"]} contentStyle={{ background: "hsl(240 10% 5.9%)", border: "1px solid hsl(240 3.7% 15.9%)", borderRadius: 8, fontSize: 12 }} />
          <ReferenceLine y={90} stroke={CHART_COLORS.blue} strokeDasharray="4 2" label={{ value: "Target 90%", fill: "hsl(240 5% 64.9%)", fontSize: 10 }} />
          <Area type="monotone" dataKey="retention" stroke={CHART_COLORS.green} fill="url(#colorRetention)" strokeWidth={2} name="Retention" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
