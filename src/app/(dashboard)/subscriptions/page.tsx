"use client";

import { useState } from "react";
import { useSubscribers } from "@/hooks/useSubscribers";
import { DataTable } from "@/components/tables/DataTable";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { activeSubscribersColumns } from "@/components/tables/columns/activeSubscribersColumns";
import { cancelledUsersColumns } from "@/components/tables/columns/cancelledUsersColumns";
import { pendingSubscriptionsColumns } from "@/components/tables/columns/pendingSubscriptionsColumns";
import { trialUsersColumns } from "@/components/tables/columns/trialUsersColumns";
import { WeeklySubscriptionTrends } from "@/components/charts/WeeklySubscriptionTrends";
import { TrialToPaidFunnel } from "@/components/charts/TrialToPaidFunnel";
import { SubscriptionStatusPie } from "@/components/charts/SubscriptionStatusPie";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const TABS = [
  { key: "active",    label: "Active" },
  { key: "trial",     label: "Trials" },
  { key: "pending",   label: "Pending" },
  { key: "paused",    label: "Paused" },
  { key: "cancelled", label: "Cancelled" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const { data: subData, isLoading } = useSubscribers(activeTab);
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  const subscribers = subData?.data ?? [];
  const analyticsData = analytics?.data;

  const columns =
    activeTab === "active"    ? activeSubscribersColumns
    : activeTab === "trial"   ? trialUsersColumns
    : activeTab === "pending" ? pendingSubscriptionsColumns
    : cancelledUsersColumns;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <WeeklySubscriptionTrends
            data={analyticsData?.weekly ?? []}
            isLoading={analyticsLoading}
          />
        </div>
        <SubscriptionStatusPie />
      </div>

      <TrialToPaidFunnel
        data={analyticsData?.funnel ?? []}
        isLoading={analyticsLoading}
      />

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex gap-1 mb-5 border-b border-border pb-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Loading subscriptions…" />
          </div>
        ) : (
          <DataTable
            columns={columns as never}
            data={subscribers}
            toolbar={(table) => (
              <TableToolbar
                table={table}
                exportFilename={`${activeTab}-subscriptions`}
                placeholder="Search subscriptions…"
              />
            )}
          />
        )}
      </div>
    </div>
  );
}
