"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS } from "@/lib/constants/chartColors";

interface Props {
  data: Array<{ date: string; subscriptions: number; cancellations: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function ActiveVsCancelled({ data, isLoading, isError }: Props) {
  const weekly = data?.filter((_, i) => i % 7 === 0).slice(-8) ?? [];
  return (
    <ChartWrapper
      title="Active vs Cancelled"
      description="Weekly comparison"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!weekly.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weekly} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "hsl(240 10% 5.9%)", border: "1px solid hsl(240 3.7% 15.9%)", borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="subscriptions" fill={CHART_COLORS.green} radius={[3, 3, 0, 0]} name="New Subs" fillOpacity={0.85} />
          <Bar dataKey="cancellations" fill={CHART_COLORS.red} radius={[3, 3, 0, 0]} name="Cancellations" fillOpacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
