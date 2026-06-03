export const runtime = 'edge';

import { NextResponse } from "next/server";

// No backend endpoint exists for admin logs yet.
// Returns an empty dataset so the Admin Logs page renders cleanly.
export async function GET() {
  return NextResponse.json({
    data: [],
    meta: { source: "database", total: 0 },
  });
}
