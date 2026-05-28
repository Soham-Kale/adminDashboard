import { KpiCard } from "./KpiCard";
import type { DashboardMetrics } from "@/types/metrics";

interface KpiGridProps {
  metrics: DashboardMetrics;
}

const METRIC_ORDER: Array<keyof DashboardMetrics> = [
  "newSubscriptionsToday",
  "triedSubscribingToday",
  "cancelledAccessEnded",
  "cancelledAccessActive",
  "trialEndedChargedToday",
  "totalActiveSubscriptions",
  "totalCancellations",
  "newUsersOnboarded",
  "revenue",
  "conversionRate",
  "churnRate",
  "retentionRate",
  "monthlyGrowth",
];

export function KpiGrid({ metrics }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {METRIC_ORDER.map((key, index) => (
        <KpiCard key={key} metric={metrics[key]} index={index} />
      ))}
    </div>
  );
}
