import type { ColumnDef } from "@tanstack/react-table";
import type { Subscriber } from "@/types/subscription";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";

export const activeSubscribersColumns: ColumnDef<Subscriber, unknown>[] = [
  { accessorKey: "userName", header: "Name", cell: ({ getValue }) => <span className="font-medium text-foreground">{getValue() as string}</span> },
  { accessorKey: "email", header: "Email", cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span> },
  { accessorKey: "planType", header: "Plan", cell: ({ getValue }) => <span className="capitalize text-xs font-medium">{getValue() as string}</span> },
  { accessorKey: "subscriptionStatus", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
  { accessorKey: "revenue", header: "Revenue", cell: ({ getValue }) => <span className="text-green-400 font-medium">{formatCurrency(getValue() as number)}</span> },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "deviceType", header: "Device", cell: ({ getValue }) => <span className="capitalize">{getValue() as string}</span> },
  { accessorKey: "paymentStatus", header: "Payment", cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
  { accessorKey: "renewalDate", header: "Renewal", cell: ({ getValue }) => getValue() ? <span className="text-muted-foreground text-xs">{formatDate(getValue() as string)}</span> : <span className="text-muted-foreground">—</span> },
];
