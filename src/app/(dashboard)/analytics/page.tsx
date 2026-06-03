"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { ChurnAnalytics } from "@/components/charts/ChurnAnalytics";
import { RetentionAnalytics } from "@/components/charts/RetentionAnalytics";
import { HeatmapAnalytics } from "@/components/charts/HeatmapAnalytics";
import { RevenueGrowthBar } from "@/components/charts/RevenueGrowthBar";
import { WeeklySubscriptionTrends } from "@/components/charts/WeeklySubscriptionTrends";
import { InsightGrid } from "@/components/dashboard/InsightGrid";
import { generateInsights } from "@/lib/utils/calculations";

export default function AnalyticsPage() {
  const { data: analytics, isLoading, isError } = useAnalytics();
  const { data: metricsData } = useDashboardMetrics();

  const analyticsData = analytics?.data;
  const insights = metricsData?.data ? generateInsights(metricsData.data) : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChurnAnalytics
          data={analyticsData?.daily ?? []}
          isLoading={isLoading}
          isError={isError}
        />
        <RetentionAnalytics
          data={analyticsData?.daily ?? []}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <HeatmapAnalytics
        data={analyticsData?.heatmap}
        isLoading={isLoading}
        isError={isError}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RevenueGrowthBar
          data={analyticsData?.monthly}
          isLoading={isLoading}
          isError={isError}
        />
        <WeeklySubscriptionTrends
          data={analyticsData?.weekly ?? []}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      {insights.length > 0 && <InsightGrid insights={insights} />}
    </div>
  );
}
