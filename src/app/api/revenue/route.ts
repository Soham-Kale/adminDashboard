export const runtime = 'edge';

import { NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backendClient";

const VALID_TYPES = new Set(["history", "failed"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type    = searchParams.get("type") ?? "history";
  const page    = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("page_size") ?? "50";

  if (!VALID_TYPES.has(type)) {
    return NextResponse.json(
      { error: "Invalid type. Use 'history' or 'failed'", code: "INVALID_TYPE" },
      { status: 400 }
    );
  }

  try {
    const qs = new URLSearchParams({ type, page, page_size: pageSize });
    const data = await backendGet(`/admin/revenue?${qs.toString()}`);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Revenue error:", err);
    return NextResponse.json(
      { error: "Failed to fetch revenue data", code: "BACKEND_UNAVAILABLE" },
      { status: 503 }
    );
  }
}
