"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";
import { useCurrencyStore } from "@/store/currencyStore";
import { pickRevenue } from "@/lib/api/services";

interface ComparativeData {
  today: Record<string, unknown>;
  yesterday: Record<string, unknown>;
}

interface Props {
  data?: ComparativeData;
  isLoading?: boolean;
  isError?: boolean;
}

export function ComparativeAnalytics({ data, isLoading, isError }: Props) {
  const { selectedCurrency } = useCurrencyStore();

  function getRevenue(rev: unknown): number {
    if (!rev) return 0;
    if (typeof rev === "object") return pickRevenue(rev as Record<string,number>, selectedCurrency);
    if (typeof rev === "number") return Math.round(rev);
    return 0;
  }

  const chartData = data
    ? [
        { metric: "Subs",     today: data.today.subscriptions,     yesterday: data.yesterday.subscriptions },
        { metric: "Cancels",  today: data.today.cancellations,     yesterday: data.yesterday.cancellations },
        { metric: "Revenue",  today: getRevenue(data.today.revenue), yesterday: getRevenue(data.yesterday.revenue) },
        { metric: "Trials",   today: data.today.trials,            yesterday: data.yesterday.trials },
        { metric: "Onboarded",today: data.today.onboarded,         yesterday: data.yesterday.onboarded },
      ]
    : [];

  return (
    <ChartWrapper
      title="Today vs Yesterday"
      description="Comparative metrics"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!chartData.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" vertical={false} />
          <XAxis dataKey="metric" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="today" fill={CHART_COLORS.blue} radius={[3, 3, 0, 0]} name="Today" fillOpacity={0.9} />
          <Bar dataKey="yesterday" fill={CHART_COLORS.purple} radius={[3, 3, 0, 0]} name="Yesterday" fillOpacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
