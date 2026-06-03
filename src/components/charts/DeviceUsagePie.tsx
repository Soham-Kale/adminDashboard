"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";

interface Props {
  data?: Array<{ device: string; value: number; percentage: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

const DEVICE_COLORS = [CHART_COLORS.blue, CHART_COLORS.purple, CHART_COLORS.cyan];

export function DeviceUsagePie({ data, isLoading, isError }: Props) {
  return (
    <ChartWrapper
      title="Device Usage"
      description="Profile-tracked devices only — excludes subscribers without a device record"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data?.length}
      height="h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="42%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            nameKey="device"
          >
            {data?.map((_, i) => (
              <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: unknown, _: unknown, props: { payload?: { percentage?: number } }) => [`${v} tracked (${props.payload?.percentage ?? 0}% of tracked)`, ""]}
            contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={TOOLTIP_STYLE.itemStyle}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
