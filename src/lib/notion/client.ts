import { Client } from "@notionhq/client";

let notionClient: Client | null = null;

export function getNotionClient(): Client | null {
  if (!process.env.NOTION_API_KEY) return null;
  if (!notionClient) {
    notionClient = new Client({ auth: process.env.NOTION_API_KEY });
  }
  return notionClient;
}

export function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
}
