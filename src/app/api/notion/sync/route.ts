import { NextResponse } from "next/server";
import { isNotionConfigured } from "@/lib/notion/client";
import { queryAllSubscribers } from "@/lib/notion/queries";

export async function POST() {
  if (!isNotionConfigured()) {
    return NextResponse.json({
      success: false,
      message: "Notion is not configured. Add NOTION_API_KEY and NOTION_DATABASE_ID to .env.local",
      source: "mock",
    });
  }

  try {
    const pages = await queryAllSubscribers();
    return NextResponse.json({
      success: true,
      message: `Synced ${pages.length} records from Notion`,
      count: pages.length,
      lastSynced: new Date().toISOString(),
      source: "notion",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Sync failed. Check your Notion API key and database permissions." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    connected: isNotionConfigured(),
    source: isNotionConfigured() ? "notion" : "mock",
    databaseId: process.env.NOTION_DATABASE_ID ? `...${process.env.NOTION_DATABASE_ID.slice(-6)}` : null,
    lastSynced: null,
  });
}
