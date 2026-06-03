"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";

interface Props {
  data?: Array<{ month: string; revenue: Record<string,number> | number; growth: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function RevenueGrowthBar({ data, isLoading, isError }: Props) {
  return (
    <ChartWrapper
      title="Revenue Growth"
      description="Month-over-month revenue growth percentage"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data?.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip formatter={(v: unknown) => [`${v}%`, "Growth"]} contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle} />
          <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
            {data?.map((d, i) => (
              <Cell
                key={i}
                fill={d.growth >= 10 ? CHART_COLORS.green : d.growth >= 5 ? CHART_COLORS.blue : CHART_COLORS.orange}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
