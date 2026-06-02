import type { ColumnDef } from "@tanstack/react-table";
import type { FailedPayment } from "@/types/revenue";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";

export const failedPaymentsColumns: ColumnDef<FailedPayment, unknown>[] = [
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
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="text-red-400 font-semibold">{formatCurrency(getValue() as number)}</span>
    ),
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ getValue }) => <span className="text-xs font-mono">{getValue() as string}</span>,
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span>,
  },
  {
    accessorKey: "retryCount",
    header: "Retries",
    cell: ({ getValue }) => <span>{getValue() as number}</span>,
  },
  {
    accessorKey: "attemptedAt",
    header: "Attempted",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span>
    ),
  },
  {
    accessorKey: "userSubscriptionId",
    header: "Subscription ID",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">{getValue() as string}</span>
    ),
  },
];
