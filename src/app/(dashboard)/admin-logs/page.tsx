"use client";

import { useAdminLogs } from "@/hooks/useAdminLogs";
import { DataTable } from "@/components/tables/DataTable";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { adminLogsColumns } from "@/components/tables/columns/adminLogsColumns";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function AdminLogsPage() {
  const { data, isLoading } = useAdminLogs();
  const logs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Admin Activity Logs
          <span className="ml-2 text-xs text-muted-foreground font-normal">({logs.length} entries)</span>
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Loading logs…" />
          </div>
        ) : (
          <DataTable
            columns={adminLogsColumns as never}
            data={logs}
            toolbar={(table) => (
              <TableToolbar table={table} exportFilename="admin-logs" placeholder="Search logs…" />
            )}
          />
        )}
      </div>
    </div>
  );
}
