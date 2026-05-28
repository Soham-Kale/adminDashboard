export interface KpiMetric {
  id: string;
  label: string;
  value: number | string;
  displayValue: string;
  delta: number;
  deltaDirection: "up" | "down" | "neutral";
  description: string;
  color: "green" | "red" | "blue" | "orange" | "purple" | "cyan" | "yellow";
  icon: string;
  sparklineData?: number[];
}

export interface DashboardMetrics {
  newSubscriptionsToday: KpiMetric;
  triedSubscribingToday: KpiMetric;
  cancelledAccessEnded: KpiMetric;
  cancelledAccessActive: KpiMetric;
  trialEndedChargedToday: KpiMetric;
  totalActiveSubscriptions: KpiMetric;
  totalCancellations: KpiMetric;
  newUsersOnboarded: KpiMetric;
  revenue: KpiMetric;
  conversionRate: KpiMetric;
  churnRate: KpiMetric;
  retentionRate: KpiMetric;
  monthlyGrowth: KpiMetric;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface FunnelData {
  stage: string;
  value: number;
  percentage: number;
}

export interface CountryData {
  country: string;
  users: number;
  percentage: number;
}

export interface DeviceData {
  device: string;
  value: number;
  percentage: number;
}

export interface HeatmapCell {
  day: string;
  hour: number;
  value: number;
}

export interface Insight {
  id: string;
  type: "success" | "warning" | "info" | "danger";
  title: string;
  body: string;
  action?: string;
  href?: string;
  metric?: string;
  change?: string;
}
