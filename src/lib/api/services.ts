/**
 * API Service Layer
 *
 * All 6 endpoint calls live here as typed, named functions.
 *
 * To switch from mock data (Next.js routes) to the real Python backend:
 *   Set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local
 *   No code changes needed — every hook uses these functions.
 */

import apiClient from "./axios";
import type { DashboardMetrics, TimeRange } from "@/types/metrics";
import type { Subscriber } from "@/types/subscription";
import type { RevenueRecord, FailedPayment, RevenueStats } from "@/types/revenue";

// ─── Response Types ────────────────────────────────────────────────────────

export interface DashboardResponse {
  data: DashboardMetrics;
  meta: { source: string; lastSynced: string };
}

export interface SubscriptionsResponse {
  data: Subscriber[];
  meta: { source: string; total: number; page: number; pageSize: number };
}

export interface UsersResponse {
  data: Array<{
    id: string;
    userName: string;
    email: string;
    country: string;
    sport: string;
    deviceType: string;
    referralSource: string;
    onboardedAt: string;
    subscriptionId: string;
    isActive: boolean;
  }>;
  meta: { source: string; total: number };
}

export interface RevenueHistoryResponse {
  data: RevenueRecord[];
  stats: RevenueStats;
  meta: { source: string; total: number };
}

export interface RevenueFailedResponse {
  data: FailedPayment[];
  meta: { source: string; total: number };
}

export interface AnalyticsData {
  daily: Array<{
    date: string;
    fullDate: string;
    subscriptions: number;
    cancellations: number;
    revenue: number;
    trials: number;
    onboarded: number;
  }>;
  weekly: Array<{
    week: string;
    date: string;
    subscriptions: number;
    cancellations: number;
    trials: number;
    active: number;
  }>;
  monthly: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
    growth: number;
  }>;
  countries: Array<{ country: string; users: number; percentage: number }>;
  devices: Array<{ device: string; value: number; percentage: number }>;
  funnel: Array<{ stage: string; value: number; percentage: number }>;
  heatmap: Array<{ day: string; hour: number; value: number }>;
  comparative: {
    today: { subscriptions: number; cancellations: number; revenue: number; trials: number; onboarded: number };
    yesterday: { subscriptions: number; cancellations: number; revenue: number; trials: number; onboarded: number };
  };
  sports: Array<{ sport: string; users: number; percentage: number }>;
  sportStatus: Array<{ sport: string; active: number; trial: number; cancelled: number }>;
  regions: Array<{ region: string; users: number; percentage: number }>;
  // From real backend — billing cycle, payment provider, plan distribution
  billingBreakdown?: Array<{ cycle: string; value: number; percentage: number }>;
  providers?: Array<{ provider: string; value: number; percentage: number }>;
  plans?: Array<{ plan: string; value: number; percentage: number }>;
}

export interface AnalyticsResponse {
  data: AnalyticsData;
  meta: { source: string; range: string; days: number };
}

export interface SyncStatusResponse {
  connected: boolean;
  source: string;
  lastSynced: string | null;
  totalRecords?: number;
  databaseId?: string | null;
}

export interface SyncTriggerResponse {
  success: boolean;
  message: string;
  count?: number;
  lastSynced?: string;
  source: string;
}

// ─── Subscription Query Params ─────────────────────────────────────────────

export interface SubscriptionParams {
  status?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Service Functions ─────────────────────────────────────────────────────

/**
 * GET /api/dashboard
 * 16 KPI metrics for the dashboard header cards.
 * Cached 60 s on the frontend; backend should cache 60 s too.
 */
export async function fetchDashboardMetrics(): Promise<DashboardResponse> {
  const res = await apiClient.get<DashboardResponse>("/api/dashboard");
  return res.data;
}

/**
 * GET /api/subscriptions
 * Paginated, filterable list of subscribers.
 * Pass status to fetch a specific tab (active / pending / trial / cancelled).
 */
export async function fetchSubscriptions(
  params: SubscriptionParams = {}
): Promise<SubscriptionsResponse> {
  const query = new URLSearchParams();
  if (params.status)    query.set("status",     params.status);
  if (params.page)      query.set("page",        String(params.page));
  if (params.pageSize)  query.set("page_size",   String(params.pageSize));
  if (params.search)    query.set("search",      params.search);
  if (params.sortBy)    query.set("sort_by",     params.sortBy);
  if (params.sortOrder) query.set("sort_order",  params.sortOrder);
  const qs = query.toString();
  const res = await apiClient.get<SubscriptionsResponse>(
    `/api/subscriptions${qs ? `?${qs}` : ""}`
  );
  return res.data;
}

/**
 * GET /api/users
 * All users with sport + country + onboarding data.
 * Used by the Users page analytics and table.
 */
export async function fetchUsers(): Promise<UsersResponse> {
  const res = await apiClient.get<UsersResponse>("/api/users");
  return res.data;
}

/**
 * GET /api/revenue?type=history
 * Payment history + MRR / ARR / growth stats.
 */
export async function fetchRevenueHistory(
  page = 1,
  pageSize = 50
): Promise<RevenueHistoryResponse> {
  const res = await apiClient.get<RevenueHistoryResponse>(
    `/api/revenue?type=history&page=${page}&page_size=${pageSize}`
  );
  return res.data;
}

/**
 * GET /api/revenue?type=failed
 * Failed payment records.
 */
export async function fetchFailedPayments(
  page = 1,
  pageSize = 50
): Promise<RevenueFailedResponse> {
  const res = await apiClient.get<RevenueFailedResponse>(
    `/api/revenue?type=failed&page=${page}&page_size=${pageSize}`
  );
  return res.data;
}

/**
 * GET /api/analytics
 * All chart data: daily/weekly/monthly time series, countries, devices,
 * funnel, heatmap, sports, regions, comparative (today vs yesterday).
 * Pass range to slice: "1w" | "1m" | "6m" | "1y" | undefined (all)
 */
export async function fetchAnalytics(
  range?: TimeRange
): Promise<AnalyticsResponse> {
  const url = range ? `/api/analytics?range=${range}` : "/api/analytics";
  const res = await apiClient.get<AnalyticsResponse>(url);
  return res.data;
}

/**
 * GET /api/notion/sync  —  connection status
 * POST /api/notion/sync —  trigger a manual data refresh
 */
export async function fetchSyncStatus(): Promise<SyncStatusResponse> {
  const res = await apiClient.get<SyncStatusResponse>("/api/notion/sync");
  return res.data;
}

export async function triggerSync(): Promise<SyncTriggerResponse> {
  const res = await apiClient.post<SyncTriggerResponse>("/api/notion/sync");
  return res.data;
}
