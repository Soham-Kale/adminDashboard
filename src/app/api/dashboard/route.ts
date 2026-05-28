import { NextResponse } from "next/server";
import { SEED_METRICS } from "@/data/seeds/initialState";

export async function GET() {
  return NextResponse.json({
    data: SEED_METRICS,
    meta: { source: "mock", lastSynced: new Date().toISOString() },
  });
}
