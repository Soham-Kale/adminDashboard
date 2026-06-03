"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";

interface Props {
  data?: Array<{ stage: string; value: number; percentage: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

const FUNNEL_COLORS = [
  CHART_COLORS.blue,
  CHART_COLORS.cyan,
  CHART_COLORS.purple,
  CHART_COLORS.orange,
  CHART_COLORS.green,
];

export function TrialToPaidFunnel({ data, isLoading, isError }: Props) {
  return (
    <ChartWrapper
      title="Trial → Paid Conversion Funnel"
      description="User journey from visitor to subscriber"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data?.length}
      height="h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, bottom: 0, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="stage" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} width={100} />
          <Tooltip
            formatter={(v: unknown, _: unknown, props: { payload?: { percentage?: number } }) => [`${Number(v).toLocaleString()} (${props.payload?.percentage ?? 0}%)`, ""]}
            contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data?.map((_, i) => (
              <Cell key={i} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} fillOpacity={1 - i * 0.12} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
