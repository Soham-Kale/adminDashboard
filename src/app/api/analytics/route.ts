import { NextResponse } from "next/server";
import {
  generateDailyData,
  generateWeeklyData,
  generateMonthlyRevenue,
  COUNTRY_DATA,
  DEVICE_DATA,
  FUNNEL_DATA,
  generateHeatmapData,
} from "@/data/seeds/initialState";

const RANGE_DAYS: Record<string, number> = {
  "1w": 7,
  "1m": 30,
  "6m": 180,
  "1y": 365,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") ?? "all";
  const days = RANGE_DAYS[range] ?? 365;

  const allDaily = generateDailyData(365);
  const daily = range === "all" ? allDaily : allDaily.slice(-days);
  const weekly = generateWeeklyData(range === "1w" ? 1 : range === "1m" ? 4 : range === "6m" ? 26 : 52);
  const monthly = generateMonthlyRevenue(range === "1w" || range === "1m" ? 3 : range === "6m" ? 6 : 12);
  const heatmap = generateHeatmapData();

  const comparative = {
    today: {
      subscriptions: 3,
      cancellations: 4,
      revenue: 297,
      trials: 2,
      onboarded: 8,
    },
    yesterday: {
      subscriptions: 2,
      cancellations: 6,
      revenue: 198,
      trials: 3,
      onboarded: 8,
    },
  };

  return NextResponse.json({
    data: {
      daily,
      weekly,
      monthly,
      countries: COUNTRY_DATA,
      devices: DEVICE_DATA,
      funnel: FUNNEL_DATA,
      heatmap,
      comparative,
    },
    meta: { source: "mock", range, days },
  });
}
