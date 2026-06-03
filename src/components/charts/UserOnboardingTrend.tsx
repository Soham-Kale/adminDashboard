"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";

interface Props {
  data: Array<{ date: string; onboarded: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function UserOnboardingTrend({ data, isLoading, isError }: Props) {
  const sliced = data?.slice(-30) ?? [];
  return (
    <ChartWrapper
      title="User Onboarding Trend"
      description="New users onboarded per day (last 30 days)"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!sliced.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sliced} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="colorOnboard" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.cyan} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.cyan} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} interval={6} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle} />
          <Area type="monotone" dataKey="onboarded" stroke={CHART_COLORS.cyan} fill="url(#colorOnboard)" strokeWidth={2} name="Users Onboarded" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
