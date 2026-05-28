"use client";

import { ChartWrapper } from "./ChartWrapper";
import { cn } from "@/lib/utils/cn";

interface Props {
  data?: Array<{ day: string; hour: number; value: number }>;
  isLoading?: boolean;
  isError?: boolean;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = [0, 3, 6, 9, 12, 15, 18, 21];

function getColor(value: number, max: number): string {
  const intensity = value / max;
  if (intensity < 0.2) return "bg-blue-950/40";
  if (intensity < 0.4) return "bg-blue-900/60";
  if (intensity < 0.6) return "bg-blue-700/70";
  if (intensity < 0.8) return "bg-blue-500/80";
  return "bg-blue-400";
}

export function HeatmapAnalytics({ data, isLoading, isError }: Props) {
  const maxValue = data ? Math.max(...data.map((d) => d.value)) : 10;

  return (
    <ChartWrapper
      title="Activity Heatmap"
      description="Subscription activity by day and hour"
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data?.length}
      height="h-48"
      className="col-span-full"
    >
      <div className="w-full h-full overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="flex gap-1 mb-1 pl-10">
            {HOURS.map((h) => (
              <div key={h} className="flex-1 text-center text-[9px] text-muted-foreground">
                {h}:00
              </div>
            ))}
          </div>
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <div className="w-9 text-[9px] text-muted-foreground text-right pr-1 shrink-0">{day}</div>
              {HOURS.map((h) => {
                const hourRange = data?.filter(
                  (d) => d.day === day && d.hour >= h && d.hour < h + 3
                ) ?? [];
                const avgValue = hourRange.length
                  ? hourRange.reduce((s, d) => s + d.value, 0) / hourRange.length
                  : 0;
                return (
                  <div
                    key={h}
                    className={cn("flex-1 h-6 rounded-sm transition-all", getColor(avgValue, maxValue))}
                    title={`${day} ${h}:00 — ${Math.round(avgValue)} events`}
                  />
                );
              })}
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2 justify-end">
            <span className="text-[9px] text-muted-foreground">Less</span>
            {["bg-blue-950/40", "bg-blue-900/60", "bg-blue-700/70", "bg-blue-500/80", "bg-blue-400"].map((c, i) => (
              <div key={i} className={cn("w-3 h-3 rounded-sm", c)} />
            ))}
            <span className="text-[9px] text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}
