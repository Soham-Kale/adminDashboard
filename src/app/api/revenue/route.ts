import { NextResponse } from "next/server";
import { MOCK_REVENUE, MOCK_FAILED_PAYMENTS } from "@/data/mock/revenue";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "history";

  if (type === "failed") {
    return NextResponse.json({
      data: MOCK_FAILED_PAYMENTS,
      meta: { source: "mock", total: MOCK_FAILED_PAYMENTS.length },
    });
  }

  const totalRevenue = MOCK_REVENUE.filter((r) => r.paymentStatus === "paid").reduce(
    (sum, r) => sum + r.amount,
    0
  );

  return NextResponse.json({
    data: MOCK_REVENUE,
    stats: {
      totalRevenue,
      mrr: 2300,
      arr: 27600,
      averageRevenuePerUser: Math.round(totalRevenue / 23),
      revenueGrowth: 12,
    },
    meta: { source: "mock", total: MOCK_REVENUE.length },
  });
}
