import type { ColumnDef } from "@tanstack/react-table";
import type { Subscriber } from "@/types/subscription";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";

export const cancelledUsersColumns: ColumnDef<Subscriber, unknown>[] = [
  { accessorKey: "userName", header: "Name", cell: ({ getValue }) => <span className="font-medium text-foreground">{getValue() as string}</span> },
  { accessorKey: "email", header: "Email", cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span> },
  { accessorKey: "planType", header: "Plan", cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span> },
  { accessorKey: "subscriptionStatus", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
  { accessorKey: "revenue", header: "Revenue", cell: ({ getValue }) => <span className="text-muted-foreground">{formatCurrency(getValue() as number)}</span> },
  { accessorKey: "cancellationDate", header: "Cancelled", cell: ({ getValue }) => getValue() ? <span className="text-red-400 text-xs">{formatDate(getValue() as string)}</span> : <span>—</span> },
  { accessorKey: "accessEndDate", header: "Access Ends", cell: ({ getValue }) => getValue() ? <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span> : <span>—</span> },
  { accessorKey: "country", header: "Country" },
];
