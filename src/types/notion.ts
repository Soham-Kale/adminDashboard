export interface NotionProperty {
  id: string;
  type: string;
  [key: string]: unknown;
}

export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, NotionProperty>;
}

export interface NotionDatabase {
  id: string;
  title: Array<{ plain_text: string }>;
  properties: Record<string, { type: string; name: string }>;
}

export interface NotionSyncStatus {
  connected: boolean;
  lastSynced: string | null;
  totalRecords: number;
  source: "mock" | "notion";
  databaseId?: string;
}
