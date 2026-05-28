import { NextResponse } from "next/server";
import { MOCK_LOGS } from "@/data/mock/logs";

export async function GET() {
  return NextResponse.json({
    data: MOCK_LOGS,
    meta: { source: "mock", total: MOCK_LOGS.length },
  });
}
