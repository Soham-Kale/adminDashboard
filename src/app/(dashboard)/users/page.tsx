"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useDeferredValue } from "react";
import apiClient from "@/lib/api/axios";
import { queryKeys } from "@/lib/constants/queryKeys";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { DataTable } from "@/components/tables/DataTable";
import { UserOnboardingTrend } from "@/components/charts/UserOnboardingTrend";
import { CountryWiseUsers } from "@/components/charts/CountryWiseUsers";
import { DeviceUsagePie } from "@/components/charts/DeviceUsagePie";
import { SportWiseUsers } from "@/components/charts/SportWiseUsers";
import { RegionWiseUsers } from "@/components/charts/RegionWiseUsers";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/lib/utils/formatters";
import { Users, Activity, UserX, Search, Globe } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { AppUser } from "@/types/user";
import { cn } from "@/lib/utils/cn";

const userColumns: ColumnDef<AppUser, unknown>[] = [
  {
    accessorKey: "userName",
    header: "Name",
    cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
  },
  {
    accessorKey: "onboardedAt",
    header: "Registered",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span>
    ),
  },
];

interface StatTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

function StatTile({ icon: Icon, label, value, color, bgColor }: StatTileProps) {
  return (
    <div className={cn("flex items-center gap-4 flex-1 rounded-xl p-4 border", bgColor)}>
      <div className={cn("p-2.5 rounded-lg bg-background/50")}>
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: [...queryKeys.users.list(), page, pageSize, deferredSearch],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });
      if (deferredSearch) qs.set("search", deferredSearch);
      const res = await apiClient.get(`/api/users?${qs.toString()}`);
      return res.data;
    },
    placeholderData: (prev) => prev, // keep old data while fetching next page
  });

  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: metricsData } = useDashboardMetrics();
  const analyticsData = analytics?.data;
  const metrics = metricsData?.data;

  return (
    <div className="space-y-5">

      {/* Total Users Banner — count comes directly from /admin/users meta.total */}
      <div className="flex flex-col sm:flex-row gap-3">
        <StatTile
          icon={Users}
          label="Total Platform Users"
          value={
            usersLoading
              ? "…"
              : usersData?.meta?.total != null
                ? usersData.meta.total.toLocaleString()
                : "—"
          }
          color="text-blue-400"
          bgColor="bg-blue-500/5 border-blue-500/20"
        />
        <StatTile
          icon={Activity}
          label="Active Subscribers"
          value={metrics?.totalActiveSubscriptions?.displayValue ?? "—"}
          color="text-green-400"
          bgColor="bg-green-500/5 border-green-500/20"
        />
        <StatTile
          icon={UserX}
          label="Total Cancellations"
          value={metrics?.totalCancellations?.displayValue ?? "—"}
          color="text-red-400"
          bgColor="bg-red-500/5 border-red-500/20"
        />
      </div>

      {/* Sports Analytics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-base">🏅</span> Sports Analytics
          </h3>
          <span className="text-xs text-muted-foreground">
            * Users with multiple sports are counted in each category
          </span>
        </div>
        <div>
          <SportWiseUsers
            data={analyticsData?.sports}
            isLoading={analyticsLoading}
          />
        </div>
      </div>

      {/* Geographic Distribution */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" /> Geographic Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
          <div className="md:col-span-4 xl:col-span-4">
            <CountryWiseUsers
              data={analyticsData?.countries}
              isLoading={analyticsLoading}
            />
          </div>
          <div className="md:col-span-3 xl:col-span-3">
            <RegionWiseUsers
              data={analyticsData?.regions}
              isLoading={analyticsLoading}
            />
          </div>
        </div>
      </div>

      {/* Device + Onboarding */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
        <div className="md:col-span-3 xl:col-span-3">
          <DeviceUsagePie
            data={analyticsData?.devices}
            isLoading={analyticsLoading}
          />
        </div>
        <div className="md:col-span-4 xl:col-span-4">
          <UserOnboardingTrend
            data={analyticsData?.daily ?? []}
            isLoading={analyticsLoading}
          />
        </div>
      </div>

      {/* Users Table — server-side paginated (10k+ users) */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground">
            All Platform Users
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              {usersData?.meta?.total
                ? `${usersData.meta.total.toLocaleString()} total`
                : ""}
            </span>
          </h3>
          {/* Server-side search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name or email…"
              className="pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
        {usersLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Loading users…" />
          </div>
        ) : (
          <DataTable
            columns={userColumns as never}
            data={usersData?.data ?? []}
            serverPagination={{
              totalRows: usersData?.meta?.total ?? 0,
              page,
              pageSize,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        )}
      </div>
    </div>
  );
}
