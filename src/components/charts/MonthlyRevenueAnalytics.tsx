"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS } from "@/lib/constants/chartColors";
import { useCurrency } from "@/hooks/useCurrency";

interface Props {
  data: Array<{ month: string; revenue: number; subscriptions: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function MonthlyRevenueAnalytics({ data, isLoading, isError }: Props) {
  const { convertAmount, formatRevenue, symbol } = useCurrency();
  const lastIndex = (data?.length ?? 1) - 1;

  const converted = data?.map((d) => ({
    ...d,
    revenue: Math.round(convertAmount(d.revenue)),
  }));

  const axisFormatter = (v: number) =>
    v >= 1000 ? `${symbol}${(v / 1000).toFixed(1)}k` : `${symbol}${v}`;

  return (
    <ChartWrapper
      title="Monthly Revenue Analytics"
      description="Revenue trend over the last 12 months"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data?.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={converted} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={axisFormatter} tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: unknown) => [formatRevenue(Number(v)), "Revenue"]}
            contentStyle={{ background: "hsl(240 10% 5.9%)", border: "1px solid hsl(240 3.7% 15.9%)", borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {converted?.map((_, i) => (
              <Cell
                key={i}
                fill={i === lastIndex ? CHART_COLORS.green : CHART_COLORS.blue}
                fillOpacity={i === lastIndex ? 1 : 0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
