"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { TimeRange } from "@/types/metrics";

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "1w", label: "1W" },
  { value: "1m", label: "1M" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
];

interface MetricTimeFilterProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

export function MetricTimeFilter({ value, onChange, className }: MetricTimeFilterProps) {
  return (
    <div className={cn("flex items-center gap-1 bg-muted/40 rounded-lg p-1", className)}>
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className="relative px-3 py-1 text-xs font-medium rounded-md transition-colors z-10"
        >
          {value === r.value && (
            <motion.span
              layoutId="timefilter-pill"
              className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
            />
          )}
          <span className={cn("relative z-10", value === r.value ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            {r.label}
          </span>
        </button>
      ))}
    </div>
  );
}
