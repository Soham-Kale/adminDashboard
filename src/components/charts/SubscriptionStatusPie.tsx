"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { PIE_COLORS, TOOLTIP_STYLE } from "@/lib/constants/chartColors";

interface Props {
  data?: Array<{ name: string; value: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

const DEFAULT_DATA = [
  { name: "Active", value: 23 },
  { name: "Cancelled", value: 60 },
  { name: "Trial", value: 8 },
  { name: "Pending", value: 3 },
];

export function SubscriptionStatusPie({ data = DEFAULT_DATA, isLoading, isError }: Props) {
  return (
    <ChartWrapper
      title="Subscription Status"
      description="Current distribution by status"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data.length}
      height="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
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
