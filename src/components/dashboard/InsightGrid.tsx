"use client";

import { InsightCard } from "./InsightCard";
import type { Insight } from "@/types/metrics";
import { Lightbulb } from "lucide-react";

interface InsightGridProps {
  insights: Insight[];
}

export function InsightGrid({ insights }: InsightGridProps) {
  if (!insights.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
        <span className="text-xs text-muted-foreground ml-1">Auto-generated from your data</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {insights.map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} index={i} />
        ))}
      </div>
    </div>
  );
}
