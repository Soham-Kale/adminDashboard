"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { PIE_COLORS } from "@/lib/constants/chartColors";

interface Props {
  data?: Array<{ sport: string; users: number; percentage: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

export function SportWiseUsers({ data, isLoading, isError }: Props) {
  const sorted = data ? [...data].sort((a, b) => b.users - a.users) : [];

  return (
    <ChartWrapper
      title="Users by Sport"
      description="Total registered users per sport category"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!sorted.length}
      height="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 4, right: 60, bottom: 0, left: 10 }}
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
            formatter={(v: unknown, _: unknown, props: { payload?: { percentage?: number } }) => [
              `${v} users (${props.payload?.percentage ?? 0}%)`,
              "Users",
            ]}
            contentStyle={{
              background: "hsl(240 10% 5.9%)",
              border: "1px solid hsl(240 3.7% 15.9%)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="users" radius={[0, 6, 6, 0]} barSize={18}>
            {sorted.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.9} />
            ))}
            <LabelList
              dataKey="users"
              position="right"
              style={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
