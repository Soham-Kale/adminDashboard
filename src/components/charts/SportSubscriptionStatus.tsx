"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";

interface Props {
  data?: Array<{ sport: string; active: number; trial: number; cancelled: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function SportSubscriptionStatus({ data, isLoading, isError }: Props) {
  const sorted = data ? [...data].sort((a, b) => (b.active + b.trial + b.cancelled) - (a.active + a.trial + a.cancelled)) : [];

  return (
    <ChartWrapper
      title="Sport × Subscription Status"
      description="Per sport selection — users with multiple sports appear in each row"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!sorted.length}
      height="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 4, right: 8, bottom: 0, left: 10 }}
          barSize={14}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="sport"
            tick={{ fontSize: 11, fill: "hsl(0 0% 85%)", fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            width={82}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="active" stackId="a" fill={CHART_COLORS.green} fillOpacity={0.85} name="Active" radius={[0, 0, 0, 0]} />
          <Bar dataKey="trial" stackId="a" fill={CHART_COLORS.purple} fillOpacity={0.85} name="Trial" />
          <Bar dataKey="cancelled" stackId="a" fill={CHART_COLORS.red} fillOpacity={0.75} name="Cancelled" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
