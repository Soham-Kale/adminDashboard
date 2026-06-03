export const runtime = 'edge';

import { NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backendClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page     = searchParams.get("page")      ?? "1";
  const pageSize = searchParams.get("page_size")  ?? "50";
  const search   = searchParams.get("search")    ?? "";

  try {
    const qs = new URLSearchParams({ page, page_size: pageSize });
    if (search) qs.set("search", search);

    const data = await backendGet(`/admin/users?${qs.toString()}`);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Users error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users", code: "BACKEND_UNAVAILABLE" },
      { status: 503 }
    );
  }
}
