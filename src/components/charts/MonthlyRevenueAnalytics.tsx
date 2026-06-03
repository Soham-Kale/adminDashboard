"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";
import { useCurrencyStore } from "@/store/currencyStore";
import { pickRevenue } from "@/lib/api/services";

interface Props {
  data: Array<{ month: string; revenue: Record<string, number> | number; subscriptions: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

function formatAxis(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}k`;
  return String(v);
}

export function MonthlyRevenueAnalytics({ data, isLoading, isError }: Props) {
  const { selectedCurrency } = useCurrencyStore();
  const lastIndex = (data?.length ?? 1) - 1;

  const converted = data?.map((d) => ({
    ...d,
    revenue: typeof d.revenue === "object"
      ? pickRevenue(d.revenue, selectedCurrency)
      : (d.revenue ?? 0),
  }));

  return (
    <ChartWrapper
      title="Monthly Revenue Analytics"
      description={`Revenue by ${selectedCurrency} — other currencies shown at their native value`}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data?.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={converted} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={formatAxis} tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: unknown) => [`${selectedCurrency} ${Number(v).toLocaleString()}`, "Revenue"]}
            contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle}
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
