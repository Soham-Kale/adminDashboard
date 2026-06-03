import type { TimeRange, MetricStats, OverlapSeries, MetricTableRow } from "@/types/metrics";
import { CHART_COLORS } from "@/lib/constants/chartColors";

interface DailyPoint {
  date: string;
  fullDate?: string;
  subscriptions: number;
  cancellations: number;
  revenue: Record<string,number> | number;
  trials: number;
  onboarded: number;
}

const RANGE_DAYS: Record<TimeRange, number> = {
  "1w": 7,
  "1m": 30,
  "6m": 180,
  "1y": 365,
};

// Maps a metric ID to the field in the daily data point it cares about
const METRIC_FIELD_MAP: Record<string, keyof DailyPoint> = {
  new_subscriptions_today: "subscriptions",
  tried_subscribing_today: "subscriptions",
  cancelled_access_ended: "cancellations",
  cancelled_access_active: "cancellations",
  trial_ended_charged_today: "trials",
  total_active_subscriptions: "subscriptions",
  total_cancellations: "cancellations",
  new_users_onboarded: "onboarded",
  revenue: "revenue",
  conversion_rate: "subscriptions",
  churn_rate: "cancellations",
  retention_rate: "subscriptions",
  monthly_growth: "subscriptions",
  total_users: "onboarded",
  daily_active_users: "onboarded",
  daily_cancellations: "cancellations",
};

function sliceByRange(data: DailyPoint[], range: TimeRange): DailyPoint[] {
  const days = RANGE_DAYS[range];
  return data.slice(-days);
}

function getFieldValue(point: DailyPoint, metricId: string): number {
  const field = METRIC_FIELD_MAP[metricId] ?? "subscriptions";
  return (point[field] as number) ?? 0;
}

function computeStats(values: number[]): MetricStats {
  if (!values.length) return { high: 0, low: 0, avg: 0, total: 0 };
  const total = values.reduce((a, b) => a + b, 0);
  return {
    high: Math.max(...values),
    low: Math.min(...values),
    avg: Math.round((total / values.length) * 10) / 10,
    total,
  };
}

export interface MetricChartResult {
  primary: Array<{ date: string; value: number }>;
  overlap: OverlapSeries[];
  stats: MetricStats;
  tableRows: MetricTableRow[];
}

export function getMetricChartData(
  metricId: string,
  range: TimeRange,
  dailyData: DailyPoint[]
): MetricChartResult {
  if (!dailyData?.length) {
    return { primary: [], overlap: [], stats: { high: 0, low: 0, avg: 0, total: 0 }, tableRows: [] };
  }

  const sliced = sliceByRange(dailyData, range);
  const days = RANGE_DAYS[range];

  const primary = sliced.map((d) => ({
    date: d.date,
    value: getFieldValue(d, metricId),
  }));

  const values = primary.map((p) => p.value);
  const stats = computeStats(values);

  // Build overlap: current period, prior period (same length), 6-month average
  const priorStart = Math.max(0, dailyData.length - days * 2);
  const priorEnd = Math.max(0, dailyData.length - days);
  const priorSlice = dailyData.slice(priorStart, priorEnd);

  const sixMonthSlice = dailyData.slice(-180);
  const sixMonthAvg =
    sixMonthSlice.length > 0
      ? Math.round(
          sixMonthSlice.reduce((s, d) => s + getFieldValue(d, metricId), 0) /
            sixMonthSlice.length
        )
      : 0;

  const overlap: OverlapSeries[] = [
    {
      name: "Current Period",
      color: CHART_COLORS.blue,
      data: primary,
    },
    {
      name: "Prior Period",
      color: CHART_COLORS.purple,
      data: priorSlice.map((d, i) => ({
        date: sliced[i]?.date ?? d.date,
        value: getFieldValue(d, metricId),
      })),
    },
    {
      name: "6M Average",
      color: CHART_COLORS.orange,
      data: primary.map((p) => ({ date: p.date, value: sixMonthAvg })),
    },
  ];

  // Table rows with delta vs previous day
  const tableRows: MetricTableRow[] = primary.map((p, i) => {
    const prev = i > 0 ? primary[i - 1].value : p.value;
    const delta = prev === 0 ? 0 : Math.round(((p.value - prev) / prev) * 1000) / 10;
    return {
      date: p.date,
      value: p.value,
      delta,
      deltaDirection: delta > 0 ? "up" : delta < 0 ? "down" : "neutral",
    };
  });

  return { primary, overlap, stats, tableRows };
}

// Determines which Recharts chart type to use for a given metric
export function getChartTypeForMetric(metricId: string): "area" | "bar" | "line" {
  const areaMetrics = new Set([
    "new_subscriptions_today",
    "total_active_subscriptions",
    "total_users",
    "daily_active_users",
    "retention_rate",
  ]);
  const barMetrics = new Set([
    "revenue",
    "new_users_onboarded",
    "trial_ended_charged_today",
    "monthly_growth",
  ]);
  if (areaMetrics.has(metricId)) return "area";
  if (barMetrics.has(metricId)) return "bar";
  return "line";
}

export function getReferenceLineForMetric(metricId: string): number | null {
  const refs: Record<string, number> = {
    churn_rate: 8,
    retention_rate: 90,
    conversion_rate: 25,
  };
  return refs[metricId] ?? null;
}
