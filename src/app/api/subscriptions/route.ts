import { NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backendClient";

const VALID_STATUSES = new Set([
  "active", "trial", "pending", "paused", "cancelled", "expired",
]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status    = searchParams.get("status") ?? "";
  const page      = searchParams.get("page") ?? "1";
  const pageSize  = searchParams.get("page_size") ?? "50";
  const search    = searchParams.get("search") ?? "";
  const sortBy    = searchParams.get("sort_by") ?? "";
  const sortOrder = searchParams.get("sort_order") ?? "";

  if (status && !VALID_STATUSES.has(status)) {
    return NextResponse.json(
      { error: "Invalid status value", code: "INVALID_STATUS" },
      { status: 400 }
    );
  }

  try {
    const qs = new URLSearchParams();
    if (status)    qs.set("status",     status);
    if (page)      qs.set("page",       page);
    if (pageSize)  qs.set("page_size",  pageSize);
    if (search)    qs.set("search",     search);
    if (sortBy)    qs.set("sort_by",    sortBy);
    if (sortOrder) qs.set("sort_order", sortOrder);

    const data = await backendGet(`/admin/subscriptions?${qs.toString()}`);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Subscriptions error:", err);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions", code: "BACKEND_UNAVAILABLE" },
      { status: 503 }
    );
  }
}
