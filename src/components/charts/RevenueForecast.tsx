"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";
import { useCurrency } from "@/hooks/useCurrency";

interface Props {
  data?: Array<{ month: string; revenue: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function RevenueForecast({ data, isLoading, isError }: Props) {
  const { convertAmount, formatRevenue, symbol } = useCurrency();

  const forecast = data
    ? [
        ...data.map((d) => ({
          ...d,
          revenue: Math.round(convertAmount(d.revenue)),
          type: "actual" as const,
          forecast: null,
        })),
        ...[1, 2, 3].map((m) => {
          const lastRevenue = data[data.length - 1]?.revenue ?? 2300;
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const lastMonth = data[data.length - 1]?.month ?? "Dec";
          const lastIdx = months.indexOf(lastMonth);
          return {
            month: months[(lastIdx + m) % 12],
            revenue: null,
            forecast: Math.round(convertAmount(lastRevenue) * Math.pow(1.08, m / 12) * (1 + m * 0.02)),
            type: "forecast" as const,
          };
        }),
      ]
    : [];

  return (
    <ChartWrapper
      title="Revenue Forecast"
      description="Actual revenue + 3-month forecast at 8% MoM growth"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!forecast.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={forecast} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(v: number) => v >= 1000 ? `${symbol}${(v / 1000).toFixed(1)}k` : `${symbol}${v}`} tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v: unknown) => v ? [formatRevenue(Number(v)), "Revenue"] : ["N/A", ""]} contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle} />
          <ReferenceLine x={data?.[data.length - 1]?.month} stroke="hsl(240 5% 64.9%)" strokeDasharray="4 2" label={{ value: "Today", fill: "hsl(240 5% 64.9%)", fontSize: 10 }} />
          <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} connectNulls name="Actual" />
          <Line type="monotone" dataKey="forecast" stroke={CHART_COLORS.orange} strokeWidth={2} dot={{ fill: CHART_COLORS.orange, r: 4 }} strokeDasharray="6 3" connectNulls name="Forecast" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
