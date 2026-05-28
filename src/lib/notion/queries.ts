import { getNotionClient } from "./client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const DB_ID = process.env.NOTION_DATABASE_ID ?? "";

export async function queryAllSubscribers(pageSize = 100): Promise<PageObjectResponse[]> {
  const notion = getNotionClient();
  if (!notion) return [];

  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: DB_ID,
      page_size: pageSize,
      start_cursor: cursor,
    });
    pages.push(...(response.results as PageObjectResponse[]));
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return pages;
}

export async function queryActiveSubscribers(): Promise<PageObjectResponse[]> {
  const notion = getNotionClient();
  if (!notion) return [];

  const response = await notion.databases.query({
    database_id: DB_ID,
    filter: {
      property: "Subscription Status",
      select: { equals: "active" },
    },
  });
  return response.results as PageObjectResponse[];
}

export async function querySubscribersByStatus(status: string): Promise<PageObjectResponse[]> {
  const notion = getNotionClient();
  if (!notion) return [];

  const response = await notion.databases.query({
    database_id: DB_ID,
    filter: {
      property: "Subscription Status",
      select: { equals: status },
    },
  });
  return response.results as PageObjectResponse[];
}

export async function getDatabaseInfo() {
  const notion = getNotionClient();
  if (!notion) return null;

  try {
    const db = await notion.databases.retrieve({ database_id: DB_ID });
    return db;
  } catch {
    return null;
  }
}
