import type { ColumnDef } from "@tanstack/react-table";
import type { Subscriber } from "@/types/subscription";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils/formatters";

export const pendingSubscriptionsColumns: ColumnDef<Subscriber, unknown>[] = [
  { accessorKey: "userName", header: "Name", cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span> },
  { accessorKey: "email", header: "Email", cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span> },
  { accessorKey: "planType", header: "Plan", cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span> },
  { accessorKey: "paymentStatus", header: "Payment", cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "deviceType", header: "Device", cell: ({ getValue }) => <span className="capitalize">{getValue() as string}</span> },
  { accessorKey: "createdAt", header: "Started", cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span> },
];
