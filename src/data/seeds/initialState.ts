import { format, subDays } from "date-fns";
import type { DashboardMetrics } from "@/types/metrics";

function generateSparkline(base: number, variance: number = 0.3): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const noise = (Math.random() - 0.5) * 2 * variance;
    return Math.max(0, Math.round(base * (1 + noise)));
  });
}

export const SEED_METRICS: DashboardMetrics = {
  newSubscriptionsToday: {
    id: "new_subscriptions_today",
    label: "New Subscriptions Today",
    value: 3,
    displayValue: "3",
    delta: 50,
    deltaDirection: "up",
    description: "vs yesterday (2)",
    color: "green",
    icon: "UserPlus",
    sparklineData: [1, 2, 1, 3, 2, 2, 3],
  },
  triedSubscribingToday: {
    id: "tried_subscribing_today",
    label: "Tried Subscribing",
    value: 3,
    displayValue: "3",
    delta: 0,
    deltaDirection: "neutral",
    description: "Pending completions",
    color: "orange",
    icon: "Clock",
    sparklineData: [2, 3, 4, 2, 3, 3, 3],
  },
  cancelledAccessEnded: {
    id: "cancelled_access_ended",
    label: "Cancelled – Access Ended",
    value: 2,
    displayValue: "2",
    delta: -33,
    deltaDirection: "down",
    description: "vs yesterday (3)",
    color: "red",
    icon: "UserMinus",
    sparklineData: [3, 2, 4, 3, 2, 3, 2],
  },
  cancelledAccessActive: {
    id: "cancelled_access_active",
    label: "Cancelled – Access Active",
    value: 2,
    displayValue: "2",
    delta: 0,
    deltaDirection: "neutral",
    description: "Access till period end",
    color: "yellow",
    icon: "UserCheck",
    sparklineData: [1, 2, 2, 3, 2, 2, 2],
  },
  trialEndedChargedToday: {
    id: "trial_ended_charged_today",
    label: "Trial → Charged Today",
    value: 0,
    displayValue: "0",
    delta: -100,
    deltaDirection: "down",
    description: "vs yesterday (1)",
    color: "purple",
    icon: "CreditCard",
    sparklineData: [0, 1, 0, 1, 0, 1, 0],
  },
  totalActiveSubscriptions: {
    id: "total_active_subscriptions",
    label: "Active Subscriptions",
    value: 23,
    displayValue: "23",
    delta: 15,
    deltaDirection: "up",
    description: "vs last month (20)",
    color: "blue",
    icon: "Users",
    sparklineData: [18, 19, 20, 21, 21, 22, 23],
  },
  totalCancellations: {
    id: "total_cancellations",
    label: "Total Cancellations",
    value: 60,
    displayValue: "60",
    delta: 5,
    deltaDirection: "up",
    description: "All time",
    color: "red",
    icon: "XCircle",
    sparklineData: [52, 54, 55, 57, 58, 59, 60],
  },
  newUsersOnboarded: {
    id: "new_users_onboarded",
    label: "Users Onboarded",
    value: 16,
    displayValue: "16",
    delta: 14,
    deltaDirection: "up",
    description: "Today + yesterday",
    color: "cyan",
    icon: "UserCog",
    sparklineData: [8, 10, 12, 9, 11, 14, 16],
  },
  revenue: {
    id: "revenue",
    label: "Monthly Revenue",
    value: 2300,
    displayValue: "$2,300",
    delta: 12,
    deltaDirection: "up",
    description: "vs last month ($2,054)",
    color: "green",
    icon: "DollarSign",
    sparklineData: [1800, 1950, 2100, 2050, 2200, 2280, 2300],
  },
  conversionRate: {
    id: "conversion_rate",
    label: "Conversion Rate",
    value: 15,
    displayValue: "15%",
    delta: 2.5,
    deltaDirection: "up",
    description: "Trial → Paid",
    color: "purple",
    icon: "TrendingUp",
    sparklineData: [12, 13, 14, 13, 14, 15, 15],
  },
  churnRate: {
    id: "churn_rate",
    label: "Churn Rate",
    value: 8,
    displayValue: "8%",
    delta: -1,
    deltaDirection: "up",
    description: "vs last month (9%)",
    color: "orange",
    icon: "TrendingDown",
    sparklineData: [10, 9, 9, 9, 8, 8, 8],
  },
  retentionRate: {
    id: "retention_rate",
    label: "Retention Rate",
    value: 92,
    displayValue: "92%",
    delta: 1,
    deltaDirection: "up",
    description: "vs last month (91%)",
    color: "green",
    icon: "Shield",
    sparklineData: [89, 90, 90, 91, 91, 92, 92],
  },
  monthlyGrowth: {
    id: "monthly_growth",
    label: "Monthly Growth",
    value: 12,
    displayValue: "12%",
    delta: 3,
    deltaDirection: "up",
    description: "vs last month (9%)",
    color: "blue",
    icon: "BarChart2",
    sparklineData: [5, 7, 8, 9, 10, 11, 12],
  },
  totalUsers: {
    id: "total_users",
    label: "Total Users",
    value: 231,
    displayValue: "231",
    delta: 8,
    deltaDirection: "up",
    description: "All registered users",
    color: "blue",
    icon: "Users2",
    sparklineData: [200, 208, 214, 219, 224, 228, 231],
  },
  dailyActiveUsers: {
    id: "daily_active_users",
    label: "Daily Active Users",
    value: 18,
    displayValue: "18",
    delta: 12.5,
    deltaDirection: "up",
    description: "vs yesterday (16)",
    color: "green",
    icon: "Activity",
    sparklineData: [14, 15, 16, 13, 17, 16, 18],
  },
  dailyCancellations: {
    id: "daily_cancellations",
    label: "Daily Cancellations",
    value: 4,
    displayValue: "4",
    delta: -20,
    deltaDirection: "up",
    description: "vs yesterday (5)",
    color: "red",
    icon: "UserX",
    sparklineData: [6, 5, 4, 5, 3, 5, 4],
  },
};

export function generateDailyData(days: number = 365) {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const baseSubscriptions = 18 + Math.floor((i / days) * 5);
    const noise = Math.floor((Math.random() - 0.3) * 4);
    return {
      date: format(date, "MMM dd"),
      fullDate: format(date, "yyyy-MM-dd"),
      subscriptions: Math.max(0, baseSubscriptions + noise),
      cancellations: Math.max(0, Math.floor(Math.random() * 3)),
      revenue: Math.round((baseSubscriptions + noise) * 100 + Math.random() * 200),
      trials: Math.max(0, Math.floor(Math.random() * 5)),
      onboarded: Math.max(0, Math.floor(Math.random() * 8) + 1),
    };
  });
}

export function generateWeeklyData(weeks: number = 12) {
  return Array.from({ length: weeks }, (_, i) => {
    const weekLabel = `W${weeks - i}`;
    const baseValue = 120 + i * 3;
    return {
      week: weekLabel,
      date: format(subDays(new Date(), (weeks - i) * 7), "MMM dd"),
      subscriptions: baseValue + Math.floor(Math.random() * 20),
      cancellations: Math.floor(Math.random() * 15) + 5,
      trials: Math.floor(Math.random() * 25) + 10,
      active: 18 + i,
    };
  });
}

export function generateMonthlyRevenue(months: number = 12) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  return Array.from({ length: months }, (_, i) => {
    const monthIndex = (currentMonth - months + 1 + i + 12) % 12;
    const base = 1500 + i * 80;
    return {
      month: monthNames[monthIndex],
      revenue: base + Math.floor(Math.random() * 300),
      subscriptions: 15 + i,
      growth: Math.round((8 + Math.random() * 8) * 10) / 10,
    };
  });
}

export const COUNTRY_DATA = [
  { country: "United States", users: 92, percentage: 40 },
  { country: "India", users: 28, percentage: 12 },
  { country: "United Kingdom", users: 35, percentage: 15 },
  { country: "Canada", users: 23, percentage: 10 },
  { country: "Australia", users: 18, percentage: 8 },
  { country: "Germany", users: 12, percentage: 5 },
  { country: "France", users: 10, percentage: 4 },
  { country: "Other", users: 13, percentage: 6 },
];

export const DEVICE_DATA = [
  { device: "Mobile", value: 134, percentage: 58 },
  { device: "Desktop", value: 74, percentage: 32 },
  { device: "Tablet", value: 23, percentage: 10 },
];

export const FUNNEL_DATA = [
  { stage: "Visitors", value: 1240, percentage: 100 },
  { stage: "Sign Ups", value: 387, percentage: 31 },
  { stage: "Trials Started", value: 156, percentage: 13 },
  { stage: "Trial Active", value: 89, percentage: 7 },
  { stage: "Converted to Paid", value: 23, percentage: 2 },
];

export function generateHeatmapData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data: Array<{ day: string; hour: number; value: number }> = [];
  days.forEach((day) => {
    for (let hour = 0; hour < 24; hour++) {
      const isPeakHour = hour >= 8 && hour <= 22;
      const isWeekday = day !== "Sat" && day !== "Sun";
      const base = isPeakHour ? (isWeekday ? 8 : 5) : 1;
      data.push({ day, hour, value: Math.floor(base + Math.random() * 6) });
    }
  });
  return data;
}
