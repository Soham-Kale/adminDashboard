import { NextResponse } from "next/server";
import { ALL_SUBSCRIBERS } from "@/data/mock/subscribers";

export async function GET() {
  const users = ALL_SUBSCRIBERS.map((s) => ({
    id: s.id,
    userName: s.userName,
    email: s.email,
    country: s.country,
    sport: s.sport,
    deviceType: s.deviceType,
    referralSource: s.referralSource,
    onboardedAt: s.createdAt,
    subscriptionId: s.id,
    isActive: s.subscriptionStatus === "active",
  }));

  return NextResponse.json({
    data: users,
    meta: { source: "mock", total: users.length },
  });
}
