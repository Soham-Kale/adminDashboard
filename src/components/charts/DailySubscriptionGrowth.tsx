"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";

interface Props {
  data: Array<{ date: string; subscriptions: number; cancellations: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function DailySubscriptionGrowth({ data, isLoading, isError }: Props) {
  const sliced = data?.slice(-30) ?? [];

  return (
    <ChartWrapper
      title="Daily Subscription Growth"
      description="New subscriptions vs cancellations over last 30 days"
      isLoading={isLoading}
      isError={isError}
      isEmpty={sliced.length === 0}
      height="h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sliced} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Line
            type="monotone"
            dataKey="subscriptions"
            stroke={CHART_COLORS.blue}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name="Subscriptions"
          />
          <Line
            type="monotone"
            dataKey="cancellations"
            stroke={CHART_COLORS.red}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name="Cancellations"
            strokeDasharray="4 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
