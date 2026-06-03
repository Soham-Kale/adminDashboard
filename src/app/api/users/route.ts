export const runtime = 'edge';

import { NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backendClient";

export async function GET() {
  try {
    const data = await backendGet("/admin/users");
    return NextResponse.json(data);
  } catch (err) {
    console.error("Users error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users", code: "BACKEND_UNAVAILABLE" },
      { status: 503 }
    );
  }
}
