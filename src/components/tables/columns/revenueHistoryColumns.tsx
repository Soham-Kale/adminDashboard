import type { ColumnDef } from "@tanstack/react-table";
import type { RevenueRecord } from "@/types/revenue";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";

export const revenueHistoryColumns: ColumnDef<RevenueRecord, unknown>[] = [
  { accessorKey: "invoiceId", header: "Invoice", cell: ({ getValue }) => <span className="font-mono text-xs">{getValue() as string}</span> },
  { accessorKey: "userName", header: "Customer", cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span> },
  { accessorKey: "email", header: "Email", cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span> },
  { accessorKey: "planType", header: "Plan", cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span> },
  { accessorKey: "amount", header: "Amount", cell: ({ getValue }) => <span className="text-green-400 font-semibold">{formatCurrency(getValue() as number)}</span> },
  { accessorKey: "paymentStatus", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
  { accessorKey: "paymentDate", header: "Date", cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span> },
  { accessorKey: "country", header: "Country" },
];
