"use client";

import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useAnalytics } from "@/hooks/useAnalytics";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { InsightGrid } from "@/components/dashboard/InsightGrid";
import { DailySubscriptionGrowth } from "@/components/charts/DailySubscriptionGrowth";
import { MonthlyRevenueAnalytics } from "@/components/charts/MonthlyRevenueAnalytics";
import { SubscriptionStatusPie } from "@/components/charts/SubscriptionStatusPie";
import { ComparativeAnalytics } from "@/components/charts/ComparativeAnalytics";
import { ActiveVsCancelled } from "@/components/charts/ActiveVsCancelled";
import { generateInsights } from "@/lib/utils/calculations";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DashboardPage() {
  const metricsQuery = useDashboardMetrics();
  const analyticsQuery = useAnalytics();

  const metrics = metricsQuery.data?.data;
  const analytics = analyticsQuery.data?.data;

  const insights = metrics ? generateInsights(metrics) : [];

  if (metricsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" label="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {metrics && <KpiGrid metrics={metrics} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailySubscriptionGrowth
          data={analytics?.daily ?? []}
          isLoading={analyticsQuery.isLoading}
          isError={analyticsQuery.isError}
        />
        <SubscriptionStatusPie />
      </div>

      <MonthlyRevenueAnalytics
        data={analytics?.monthly ?? []}
        isLoading={analyticsQuery.isLoading}
        isError={analyticsQuery.isError}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActiveVsCancelled
          data={analytics?.daily ?? []}
          isLoading={analyticsQuery.isLoading}
          isError={analyticsQuery.isError}
        />
        <ComparativeAnalytics
          data={analytics?.comparative}
          isLoading={analyticsQuery.isLoading}
          isError={analyticsQuery.isError}
        />
      </div>

      {insights.length > 0 && <InsightGrid insights={insights} />}
    </div>
  );
}
