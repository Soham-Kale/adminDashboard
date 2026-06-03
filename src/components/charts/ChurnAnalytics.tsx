"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";

interface Props {
  data: Array<{ date: string; subscriptions: number; cancellations: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function ChurnAnalytics({ data, isLoading, isError }: Props) {
  const monthlyData = data?.filter((_, i) => i % 3 === 0).slice(-12).map((d) => ({
    date: d.date,
    churnRate: d.subscriptions > 0 ? parseFloat(((d.cancellations / d.subscriptions) * 100).toFixed(1)) : 0,
  })) ?? [];

  return (
    <ChartWrapper
      title="Churn Analytics"
      description="Monthly churn rate trend"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!monthlyData.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            formatter={(v: unknown) => [`${v}%`, "Churn Rate"]}
            contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle}
          />
          <ReferenceLine y={8} stroke={CHART_COLORS.yellow} strokeDasharray="4 2" label={{ value: "Target 8%", fill: "hsl(240 5% 64.9%)", fontSize: 10 }} />
          <Line type="monotone" dataKey="churnRate" stroke={CHART_COLORS.orange} strokeWidth={2} dot={{ fill: CHART_COLORS.orange, r: 3 }} name="Churn Rate" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
