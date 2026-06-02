"use client";

import { useState } from "react";
import { KpiCard } from "./KpiCard";
import { KpiDetailModal } from "./KpiDetailModal";
import type { DashboardMetrics } from "@/types/metrics";

interface KpiGridProps {
  metrics: DashboardMetrics;
}

const METRIC_ORDER: Array<keyof DashboardMetrics> = [
  "newSubscriptionsToday",
  "triedSubscribingToday",
  "cancelledToday",
  "pausedToday",
  "trialEndedChargedToday",
  "totalActiveSubscriptions",
  "totalCancellations",
  "newUsersOnboarded",
  "revenue",
  "conversionRate",
  "churnRate",
  "retentionRate",
  "monthlyGrowth",
  "totalUsers",
  "dailyActiveUsers",
  "dailyCancellations",
];

export function KpiGrid({ metrics }: KpiGridProps) {
  const [activeMetricId, setActiveMetricId] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {METRIC_ORDER.map((key, index) => (
          <KpiCard
            key={key}
            metric={metrics[key]}
            index={index}
            onClick={() => setActiveMetricId(metrics[key].id)}
          />
        ))}
      </div>

      {activeMetricId && (
        <KpiDetailModal
          metricId={activeMetricId}
          metrics={metrics}
          onClose={() => setActiveMetricId(null)}
        />
      )}
    </>
  );
}
