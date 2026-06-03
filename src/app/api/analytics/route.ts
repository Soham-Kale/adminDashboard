export const runtime = 'edge';

import { NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backendClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") ?? "all";

  try {
    const qs = new URLSearchParams({ range });
    const backendData = await backendGet<{ data: Record<string, unknown>; meta: unknown }>(
      `/admin/analytics?${qs.toString()}`
    );

    // Backend does not return country/sport/device breakdowns.
    // These keys are injected as empty arrays so chart components
    // render their <EmptyState> cleanly instead of crashing.
    return NextResponse.json({
      data: {
        ...backendData.data,
        countries:   [],
        devices:     [],
        sports:      [],
        sportStatus: [],
        regions:     [],
      },
      meta: backendData.meta,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics", code: "BACKEND_UNAVAILABLE" },
      { status: 503 }
    );
  }
}
