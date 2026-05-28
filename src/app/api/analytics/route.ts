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

export async function GET() {
  const daily = generateDailyData(90);
  const weekly = generateWeeklyData(12);
  const monthly = generateMonthlyRevenue(12);
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
    meta: { source: "mock" },
  });
}
