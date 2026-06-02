import { NextResponse } from "next/server";
import { backendGet, backendPost } from "@/lib/api/backendClient";

export async function GET() {
  try {
    const data = await backendGet("/admin/notion/sync");
    return NextResponse.json(data);
  } catch (err) {
    console.error("Sync status error:", err);
    return NextResponse.json(
      { error: "Failed to fetch sync status", code: "BACKEND_UNAVAILABLE" },
      { status: 503 }
    );
  }
}

export async function POST() {
  try {
    const data = await backendPost("/admin/notion/sync");
    return NextResponse.json(data);
  } catch (err) {
    console.error("Sync trigger error:", err);
    return NextResponse.json(
      { error: "Sync failed. Check backend connectivity.", code: "BACKEND_UNAVAILABLE" },
      { status: 503 }
    );
  }
}
