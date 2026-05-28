import { NextResponse } from "next/server";
import { isNotionConfigured } from "@/lib/notion/client";
import { queryAllSubscribers } from "@/lib/notion/queries";
import { transformNotionPages } from "@/lib/notion/transformers";
import { ALL_SUBSCRIBERS, MOCK_SUBSCRIBERS, MOCK_PENDING, MOCK_CANCELLED, MOCK_TRIALS } from "@/data/mock/subscribers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    let data;

    if (isNotionConfigured()) {
      const pages = await queryAllSubscribers();
      const allData = transformNotionPages(pages);
      data = status ? allData.filter((s) => s.subscriptionStatus === status) : allData;
    } else {
      if (status === "active") data = MOCK_SUBSCRIBERS;
      else if (status === "pending") data = MOCK_PENDING;
      else if (status === "cancelled_access_ended" || status === "cancelled_access_active") data = MOCK_CANCELLED;
      else if (status === "trial") data = MOCK_TRIALS;
      else data = ALL_SUBSCRIBERS;
    }

    return NextResponse.json({
      data,
      meta: {
        source: isNotionConfigured() ? "notion" : "mock",
        total: data.length,
      },
    });
  } catch (error) {
    console.error("Subscriptions API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
