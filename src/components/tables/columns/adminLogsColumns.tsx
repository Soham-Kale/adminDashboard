import type { ColumnDef } from "@tanstack/react-table";
import type { AdminLog } from "@/types/logs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils/formatters";

export const adminLogsColumns: ColumnDef<AdminLog, unknown>[] = [
  { accessorKey: "timestamp", header: "Time", cell: ({ getValue }) => <span className="text-xs font-mono text-muted-foreground">{getValue() as string}</span> },
  { accessorKey: "adminName", header: "Admin", cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span> },
  { accessorKey: "action", header: "Action", cell: ({ getValue }) => <span className="capitalize text-xs font-medium text-primary">{(getValue() as string).replace(/_/g, " ")}</span> },
  { accessorKey: "resource", header: "Resource", cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span> },
  { accessorKey: "details", header: "Details", cell: ({ getValue }) => <span className="text-xs text-muted-foreground max-w-xs truncate block">{getValue() as string}</span> },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
  { accessorKey: "ipAddress", header: "IP", cell: ({ getValue }) => <span className="text-xs font-mono text-muted-foreground">{getValue() as string}</span> },
];
