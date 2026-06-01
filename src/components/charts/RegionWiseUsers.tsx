"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartWrapper } from "./ChartWrapper";

interface Props {
  data?: Array<{ region: string; users: number; percentage: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

const REGION_COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f97316"];
const REGION_EMOJIS: Record<string, string> = {
  Americas: "🌎",
  Europe: "🌍",
  "Asia-Pacific": "🌏",
  Other: "🌐",
};

export function RegionWiseUsers({ data, isLoading, isError }: Props) {
  const total = data?.reduce((s, d) => s + d.users, 0) ?? 0;

  return (
    <ChartWrapper
      title="Users by Region"
      description="Geographic distribution by world region"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data?.length}
      height="h-72"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                dataKey="users"
                nameKey="region"
              >
                {data?.map((_, i) => (
                  <Cell key={i} fill={REGION_COLORS[i % REGION_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: unknown, _: unknown, props: { payload?: { percentage?: number } }) => [
                  `${v} users (${props.payload?.percentage ?? 0}%)`,
                  "",
                ]}
                contentStyle={{
                  background: "hsl(240 10% 5.9%)",
                  border: "1px solid hsl(240 3.7% 15.9%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        {/* Custom legend */}
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          {data?.map((d, i) => (
            <div key={d.region} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ background: REGION_COLORS[i % REGION_COLORS.length] }}
              />
              <span className="text-[11px] text-muted-foreground truncate">
                {REGION_EMOJIS[d.region] ?? ""} {d.region}
              </span>
              <span className="text-[11px] text-foreground font-semibold ml-auto">{d.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </ChartWrapper>
  );
}
