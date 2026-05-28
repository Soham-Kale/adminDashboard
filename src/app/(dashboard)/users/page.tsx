"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/axios";
import { queryKeys } from "@/lib/constants/queryKeys";
import { DataTable } from "@/components/tables/DataTable";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { UserOnboardingTrend } from "@/components/charts/UserOnboardingTrend";
import { CountryWiseUsers } from "@/components/charts/CountryWiseUsers";
import { DeviceUsagePie } from "@/components/charts/DeviceUsagePie";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ColumnDef } from "@tanstack/react-table";
import type { AppUser } from "@/types/user";

const userColumns: ColumnDef<AppUser, unknown>[] = [
  { accessorKey: "userName", header: "Name", cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span> },
  { accessorKey: "email", header: "Email", cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span> },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "deviceType", header: "Device", cell: ({ getValue }) => <span className="capitalize">{getValue() as string}</span> },
  { accessorKey: "referralSource", header: "Source", cell: ({ getValue }) => <span className="capitalize text-xs">{(getValue() as string).replace(/_/g, " ")}</span> },
  { accessorKey: "isActive", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue() ? "active" : "cancelled_access_ended"} /> },
  { accessorKey: "onboardedAt", header: "Onboarded", cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span> },
];

export default function UsersPage() {
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: async () => {
      const res = await apiClient.get("/api/users");
      return res.data;
    },
  });

  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const analyticsData = analytics?.data;

  return (
    <div className="space-y-6">
      <UserOnboardingTrend
        data={analyticsData?.daily ?? []}
        isLoading={analyticsLoading}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CountryWiseUsers
          data={analyticsData?.countries}
          isLoading={analyticsLoading}
        />
        <DeviceUsagePie
          data={analyticsData?.devices}
          isLoading={analyticsLoading}
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">All Users</h3>
        {usersLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Loading users…" />
          </div>
        ) : (
          <DataTable
            columns={userColumns as never}
            data={usersData?.data ?? []}
            toolbar={(table) => (
              <TableToolbar table={table} exportFilename="users" placeholder="Search users…" />
            )}
          />
        )}
      </div>
    </div>
  );
}
