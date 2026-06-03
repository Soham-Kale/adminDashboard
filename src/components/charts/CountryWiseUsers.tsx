"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { PIE_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";

interface Props {
  data?: Array<{ country: string; users: number; percentage: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function CountryWiseUsers({ data, isLoading, isError }: Props) {
  return (
    <ChartWrapper
      title="Users by Payment Currency"
      description="Approximated from subscriber payment currency — USD may include multiple countries"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data?.length}
      height="h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="country" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} width={90} />
          <Tooltip
            formatter={(v: unknown, _: unknown, props: { payload?: { percentage?: number } }) => [`${v} subscribers · currency-derived (${props.payload?.percentage ?? 0}%)`, ""]}
            contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle}
          />
          <Bar dataKey="users" radius={[0, 4, 4, 0]}>
            {data?.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
