import { NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backendClient";

// Fetch the total count for a given subscription status (or all).
// Uses page_size=1 to minimise payload — only meta.total matters.
async function getCount(status?: string): Promise<number> {
  try {
    const qs = status
      ? `?status=${status}&page=1&page_size=1`
      : `?page=1&page_size=1`;
    const res = await backendGet<{ meta: { total: number } }>(
      `/admin/subscriptions${qs}`
    );
    return res.meta?.total ?? 0;
  } catch {
    return 0;
  }
}

function computeDelta(
  current: number,
  prior: number
): { delta: number; deltaDirection: "up" | "down" | "neutral" } {
  if (!prior) return { delta: 0, deltaDirection: "neutral" };
  const pct = Math.round(((current - prior) / prior) * 1000) / 10;
  return {
    delta: Math.abs(pct),
    deltaDirection: pct > 0 ? "up" : pct < 0 ? "down" : "neutral",
  };
}

export async function GET() {
  try {
    // Run all backend calls in parallel
    const [
      activeCount,
      trialCount,
      cancelledCount,
      pendingCount,
      pausedCount,
      totalCount,
      analyticsRes,
    ] = await Promise.all([
      getCount("active"),
      getCount("trial"),
      getCount("cancelled"),
      getCount("pending"),
      getCount("paused"),
      getCount(),
      backendGet<{
        data: {
          daily: Array<{ subscriptions: number; cancellations: number; revenue: number; trials: number; onboarded: number }>;
          monthly: Array<{ subscriptions: number; revenue: number; growth: number }>;
          comparative: {
            today: { subscriptions: number; cancellations: number; revenue: number; trials: number; onboarded: number };
            yesterday: { subscriptions: number; cancellations: number; revenue: number; trials: number; onboarded: number };
          };
        };
      }>("/admin/analytics?range=1m"),
    ]);

    const { daily = [], monthly = [], comparative } = analyticsRes?.data ?? {};

    // Today / yesterday snapshot values
    const today     = comparative?.today     ?? { subscriptions: 0, cancellations: 0, revenue: 0, trials: 0, onboarded: 0 };
    const yesterday = comparative?.yesterday ?? { subscriptions: 0, cancellations: 0, revenue: 0, trials: 0, onboarded: 0 };

    // 7-day sparkline arrays (oldest → newest)
    const last7        = daily.slice(-7);
    const pad7         = (arr: number[]) => [...Array(Math.max(0, 7 - arr.length)).fill(0), ...arr].slice(-7);
    const sparkSubs    = pad7(last7.map((d) => d.subscriptions));
    const sparkCancels = pad7(last7.map((d) => d.cancellations));
    const sparkOnboard = pad7(last7.map((d) => d.onboarded));
    const sparkRevenue = pad7(last7.map((d) => d.revenue));
    const sparkTrials  = pad7(last7.map((d) => d.trials));

    // Revenue
    const currentMonthRevenue = monthly.at(-1)?.revenue ?? today.revenue * 30;
    const lastMonthRevenue    = monthly.at(-2)?.revenue ?? 0;
    const revGrowth = lastMonthRevenue > 0
      ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 1000) / 10
      : 0;

    // Rates
    const churnRate      = activeCount + cancelledCount > 0
      ? Math.round((cancelledCount / (activeCount + cancelledCount)) * 1000) / 10 : 0;
    const retentionRate  = Math.round((100 - churnRate) * 10) / 10;
    const conversionRate = activeCount + trialCount > 0
      ? Math.round((activeCount / (activeCount + trialCount)) * 1000) / 10 : 0;

    // Monthly growth
    const curMonthSubs  = monthly.at(-1)?.subscriptions ?? activeCount;
    const prevMonthSubs = monthly.at(-2)?.subscriptions ?? 0;
    const monthlyGrowth = prevMonthSubs > 0
      ? Math.round(((curMonthSubs - prevMonthSubs) / prevMonthSubs) * 1000) / 10 : 0;

    const subDelta    = computeDelta(today.subscriptions, yesterday.subscriptions);
    const cancelDelta = computeDelta(today.cancellations, yesterday.cancellations);
    const onboardDelta = computeDelta(today.onboarded, yesterday.onboarded);

    const metrics = {
      newSubscriptionsToday: {
        id: "new_subscriptions_today", label: "New Subscriptions Today",
        value: today.subscriptions, displayValue: String(today.subscriptions),
        ...subDelta,
        description: `vs yesterday (${yesterday.subscriptions})`,
        color: "green", icon: "UserPlus", sparklineData: sparkSubs,
      },
      triedSubscribingToday: {
        id: "tried_subscribing_today", label: "Tried Subscribing",
        value: pendingCount, displayValue: String(pendingCount),
        delta: 0, deltaDirection: "neutral",
        description: "Pending completions",
        color: "orange", icon: "Clock", sparklineData: Array(7).fill(Math.floor(pendingCount / 7) || 0),
      },
      cancelledToday: {
        id: "cancelled_today", label: "Cancelled Today",
        value: today.cancellations, displayValue: String(today.cancellations),
        ...cancelDelta,
        description: `vs yesterday (${yesterday.cancellations})`,
        color: "red", icon: "UserMinus", sparklineData: sparkCancels,
      },
      pausedToday: {
        id: "paused_today", label: "Paused Today",
        value: pausedCount, displayValue: String(pausedCount),
        delta: 0, deltaDirection: "neutral",
        description: "Access paused",
        color: "yellow", icon: "UserCheck", sparklineData: Array(7).fill(0),
      },
      trialEndedChargedToday: {
        id: "trial_ended_charged_today", label: "Trial → Charged Today",
        value: today.trials, displayValue: String(today.trials),
        delta: 0, deltaDirection: "neutral",
        description: "Trials converted today",
        color: "purple", icon: "CreditCard", sparklineData: sparkTrials,
      },
      totalActiveSubscriptions: {
        id: "total_active_subscriptions", label: "Active Subscriptions",
        value: activeCount, displayValue: String(activeCount),
        delta: Math.abs(monthlyGrowth), deltaDirection: monthlyGrowth >= 0 ? "up" : "down",
        description: `${trialCount} on trial`,
        color: "blue", icon: "Users", sparklineData: sparkSubs,
      },
      totalCancellations: {
        id: "total_cancellations", label: "Total Cancellations",
        value: cancelledCount, displayValue: String(cancelledCount),
        delta: Math.abs(cancelDelta.delta), deltaDirection: cancelDelta.deltaDirection,
        description: "All time",
        color: "red", icon: "XCircle", sparklineData: sparkCancels,
      },
      newUsersOnboarded: {
        id: "new_users_onboarded", label: "Users Onboarded",
        value: today.onboarded + yesterday.onboarded,
        displayValue: String(today.onboarded + yesterday.onboarded),
        ...onboardDelta,
        description: "Today + yesterday",
        color: "cyan", icon: "UserCog", sparklineData: sparkOnboard,
      },
      revenue: {
        id: "revenue", label: "Monthly Revenue",
        value: currentMonthRevenue,
        // No currency symbol — frontend applies the user's selected currency via useCurrency()
        displayValue: currentMonthRevenue.toLocaleString(),
        delta: Math.abs(revGrowth), deltaDirection: revGrowth >= 0 ? "up" : "down",
        description: lastMonthRevenue > 0
          ? `vs last month ${lastMonthRevenue.toLocaleString()}` : "This month",
        color: "green", icon: "DollarSign", sparklineData: sparkRevenue,
      },
      conversionRate: {
        id: "conversion_rate", label: "Conversion Rate",
        value: conversionRate, displayValue: `${conversionRate}%`,
        delta: 0, deltaDirection: "neutral",
        description: "Trial → Paid",
        color: "purple", icon: "TrendingUp", sparklineData: Array(7).fill(conversionRate),
      },
      churnRate: {
        id: "churn_rate", label: "Churn Rate",
        value: churnRate, displayValue: `${churnRate}%`,
        delta: 0, deltaDirection: "neutral",
        description: "All-time cancellation rate",
        color: "orange", icon: "TrendingDown", sparklineData: Array(7).fill(churnRate),
      },
      retentionRate: {
        id: "retention_rate", label: "Retention Rate",
        value: retentionRate, displayValue: `${retentionRate}%`,
        delta: 0, deltaDirection: "neutral",
        description: `${retentionRate}% of users retained`,
        color: "green", icon: "Shield", sparklineData: Array(7).fill(retentionRate),
      },
      monthlyGrowth: {
        id: "monthly_growth", label: "Monthly Growth",
        value: Math.abs(monthlyGrowth), displayValue: `${Math.abs(monthlyGrowth)}%`,
        delta: Math.abs(monthlyGrowth), deltaDirection: monthlyGrowth >= 0 ? "up" : "down",
        description: prevMonthSubs > 0 ? `vs last month (${prevMonthSubs})` : "This month",
        color: "blue", icon: "BarChart2",
        sparklineData: monthly.slice(-7).map((m) => m.subscriptions ?? 0),
      },
      totalUsers: {
        id: "total_users", label: "Total Users",
        value: totalCount, displayValue: String(totalCount),
        delta: 0, deltaDirection: "neutral",
        description: "All registered users",
        color: "blue", icon: "Users2", sparklineData: Array(7).fill(Math.floor(totalCount / 7) || 0),
      },
      dailyActiveUsers: {
        id: "daily_active_users", label: "Daily Active Users",
        value: today.subscriptions, displayValue: String(today.subscriptions),
        ...subDelta,
        description: `vs yesterday (${yesterday.subscriptions})`,
        color: "green", icon: "Activity", sparklineData: sparkSubs,
      },
      dailyCancellations: {
        id: "daily_cancellations", label: "Daily Cancellations",
        value: today.cancellations, displayValue: String(today.cancellations),
        ...cancelDelta,
        description: `vs yesterday (${yesterday.cancellations})`,
        color: "red", icon: "UserX", sparklineData: sparkCancels,
      },
    };

    return NextResponse.json({
      data: metrics,
      meta: { source: "database", lastSynced: new Date().toISOString() },
    });
  } catch (err) {
    console.error("Dashboard computation error:", err);
    return NextResponse.json(
      { error: "Failed to compute dashboard metrics", code: "BACKEND_UNAVAILABLE" },
      { status: 503 }
    );
  }
}
