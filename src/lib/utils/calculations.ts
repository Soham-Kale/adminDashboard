import type { DashboardMetrics, Insight } from "@/types/metrics";

export function generateInsights(metrics: DashboardMetrics): Insight[] {
  const insights: Insight[] = [];

  const churnValue = typeof metrics.churnRate.value === "number" ? metrics.churnRate.value : 0;
  const retentionValue = typeof metrics.retentionRate.value === "number" ? metrics.retentionRate.value : 0;
  const growthValue = typeof metrics.monthlyGrowth.value === "number" ? metrics.monthlyGrowth.value : 0;
  const conversionValue = typeof metrics.conversionRate.value === "number" ? metrics.conversionRate.value : 0;

  if (metrics.newSubscriptionsToday.deltaDirection === "up") {
    insights.push({
      id: "subscription_growth",
      type: "success",
      title: "Subscription Growth",
      body: `New subscriptions increased ${metrics.newSubscriptionsToday.delta}% compared to yesterday. Keep the momentum going.`,
      metric: "+3 today",
      change: `+${metrics.newSubscriptionsToday.delta}%`,
    });
  }

  if (churnValue > 10) {
    insights.push({
      id: "high_churn",
      type: "warning",
      title: "High Churn Detected",
      body: `Churn rate at ${churnValue}% — above the 10% threshold. Consider a win-back campaign.`,
      action: "View Cancelled",
      href: "/subscriptions",
      metric: `${churnValue}% churn`,
      change: "Above target",
    });
  } else if (churnValue < 8) {
    insights.push({
      id: "low_churn",
      type: "success",
      title: "Churn Under Control",
      body: `Churn rate at ${churnValue}% — below the 8% target. Retention strategies are working.`,
      metric: `${churnValue}% churn`,
      change: "Below target",
    });
  }

  if (retentionValue >= 90) {
    insights.push({
      id: "high_retention",
      type: "success",
      title: "Strong Retention",
      body: `Retention rate of ${retentionValue}% indicates high user satisfaction. Top quartile performance.`,
      metric: `${retentionValue}% retained`,
      change: "+1% vs last month",
    });
  }

  if (growthValue >= 10) {
    insights.push({
      id: "strong_growth",
      type: "success",
      title: "Strong Monthly Growth",
      body: `${growthValue}% monthly growth places you in the top 20% of SaaS benchmarks for this segment.`,
      metric: `+${growthValue}% MoM`,
      change: `+${metrics.monthlyGrowth.delta}% vs prior`,
    });
  }

  insights.push({
    id: "device_insight",
    type: "info",
    title: "Mobile-First Users",
    body: "58% of subscribers are on mobile. Ensure mobile experience is optimized for renewals and upgrades.",
    metric: "58% mobile",
    change: "Primary platform",
  });

  if (conversionValue < 15) {
    insights.push({
      id: "conversion_opportunity",
      type: "warning",
      title: "Conversion Opportunity",
      body: `Trial-to-paid conversion at ${conversionValue}%. Industry average is 25%. Targeted onboarding emails could improve this.`,
      action: "View Trials",
      href: "/subscriptions",
      metric: `${conversionValue}% conversion`,
      change: "Below avg",
    });
  }

  return insights;
}

export function calculateMRR(activeSubscribers: number, avgRevenue: number): number {
  return activeSubscribers * avgRevenue;
}

export function calculateARR(mrr: number): number {
  return mrr * 12;
}

export function calculateChurnRate(cancelled: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((cancelled / total) * 100 * 10) / 10;
}

export function calculateRetentionRate(churnRate: number): number {
  return Math.round((100 - churnRate) * 10) / 10;
}
