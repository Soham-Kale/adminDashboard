"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/axios";
import { queryKeys } from "@/lib/constants/queryKeys";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { DataTable } from "@/components/tables/DataTable";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { UserOnboardingTrend } from "@/components/charts/UserOnboardingTrend";
import { CountryWiseUsers } from "@/components/charts/CountryWiseUsers";
import { DeviceUsagePie } from "@/components/charts/DeviceUsagePie";
import { SportWiseUsers } from "@/components/charts/SportWiseUsers";
import { SportSubscriptionStatus } from "@/components/charts/SportSubscriptionStatus";
import { RegionWiseUsers } from "@/components/charts/RegionWiseUsers";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Users, Activity, UserX, Globe } from "lucide-react";
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
    accessorKey: "sport",
    header: "Sport",
    cell: ({ getValue }) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ getValue }) => (
      <span className="flex items-center gap-1.5 text-sm">
        <Globe className="h-3 w-3 text-muted-foreground" />
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "deviceType",
    header: "Device",
    cell: ({ getValue }) => <span className="capitalize">{getValue() as string}</span>,
  },
  {
    accessorKey: "referralSource",
    header: "Source",
    cell: ({ getValue }) => (
      <span className="capitalize text-xs">{(getValue() as string).replace(/_/g, " ")}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ getValue }) => (
      <StatusBadge status={getValue() ? "active" : "cancelled_access_ended"} />
    ),
  },
  {
    accessorKey: "onboardedAt",
    header: "Onboarded",
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
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: async () => {
      const res = await apiClient.get("/api/users");
      return res.data;
    },
  });

  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: metricsData } = useDashboardMetrics();
  const analyticsData = analytics?.data;
  const metrics = metricsData?.data;

  return (
    <div className="space-y-5">

      {/* Total Users Banner */}
      <div className="flex gap-4">
        <StatTile
          icon={Users}
          label="Total Users"
          value={metrics?.totalUsers?.displayValue ?? "231"}
          color="text-blue-400"
          bgColor="bg-blue-500/5 border-blue-500/20"
        />
        <StatTile
          icon={Activity}
          label="Daily Active Users"
          value={metrics?.dailyActiveUsers?.displayValue ?? "18"}
          color="text-green-400"
          bgColor="bg-green-500/5 border-green-500/20"
        />
        <StatTile
          icon={UserX}
          label="Daily Cancellations"
          value={metrics?.dailyCancellations?.displayValue ?? "4"}
          color="text-red-400"
          bgColor="bg-red-500/5 border-red-500/20"
        />
      </div>

      {/* Sports Analytics */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-base">🏅</span> Sports Analytics
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
          <div className="xl:col-span-4">
            <SportWiseUsers
              data={analyticsData?.sports}
              isLoading={analyticsLoading}
            />
          </div>
          <div className="xl:col-span-3">
            <SportSubscriptionStatus
              data={analyticsData?.sportStatus}
              isLoading={analyticsLoading}
            />
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" /> Geographic Distribution
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
          <div className="xl:col-span-4">
            <CountryWiseUsers
              data={analyticsData?.countries}
              isLoading={analyticsLoading}
            />
          </div>
          <div className="xl:col-span-3">
            <RegionWiseUsers
              data={analyticsData?.regions}
              isLoading={analyticsLoading}
            />
          </div>
        </div>
      </div>

      {/* Device + Onboarding */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        <div className="xl:col-span-3">
          <DeviceUsagePie
            data={analyticsData?.devices}
            isLoading={analyticsLoading}
          />
        </div>
        <div className="xl:col-span-4">
          <UserOnboardingTrend
            data={analyticsData?.daily ?? []}
            isLoading={analyticsLoading}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          All Users
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            ({usersData?.meta?.total ?? 0} records)
          </span>
        </h3>
        {usersLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Loading users…" />
          </div>
        ) : (
          <DataTable
            columns={userColumns as never}
            data={usersData?.data ?? []}
            toolbar={(table) => (
              <TableToolbar table={table} exportFilename="users" placeholder="Search by name, sport, country…" />
            )}
          />
        )}
      </div>
    </div>
  );
}
