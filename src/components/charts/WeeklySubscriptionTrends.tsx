"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS } from "@/lib/constants/chartColors";

interface Props {
  data: Array<{ week: string; subscriptions: number; trials: number; active: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function WeeklySubscriptionTrends({ data, isLoading, isError }: Props) {
  return (
    <ChartWrapper
      title="Weekly Subscription Trends"
      description="12-week subscription activity"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data?.length}
      height="h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.blue} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTrials" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.purple} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.purple} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "hsl(240 10% 5.9%)", border: "1px solid hsl(240 3.7% 15.9%)", borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="subscriptions" stroke={CHART_COLORS.blue} fill="url(#colorSubs)" strokeWidth={2} name="Subscriptions" />
          <Area type="monotone" dataKey="trials" stroke={CHART_COLORS.purple} fill="url(#colorTrials)" strokeWidth={2} name="Trials" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
