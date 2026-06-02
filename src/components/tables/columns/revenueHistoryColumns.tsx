import type { ColumnDef } from "@tanstack/react-table";
import type { RevenueRecord } from "@/types/revenue";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";

export const revenueHistoryColumns: ColumnDef<RevenueRecord, unknown>[] = [
  {
    accessorKey: "userSubscriptionId",
    header: "Subscription",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "userName",
    header: "Customer",
    cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
  },
  {
    accessorKey: "billingCycle",
    header: "Plan",
    cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="text-green-400 font-semibold">{formatCurrency(getValue() as number)}</span>
    ),
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ getValue }) => <span className="text-xs font-mono">{getValue() as string}</span>,
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span>,
  },
  {
    accessorKey: "paymentDate",
    header: "Date",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span>
    ),
  },
];
