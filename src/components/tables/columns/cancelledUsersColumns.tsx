import type { ColumnDef } from "@tanstack/react-table";
import type { Subscriber } from "@/types/subscription";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils/formatters";

export const cancelledUsersColumns: ColumnDef<Subscriber, unknown>[] = [
  {
    accessorKey: "userName",
    header: "Name",
    cell: ({ getValue }) => <span className="font-medium text-foreground">{getValue() as string}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ getValue }) => (
      <span className="text-xs font-mono">{(getValue() as string | null) || "—"}</span>
    ),
  },
  {
    accessorKey: "sport",
    header: "Sport",
    cell: ({ getValue }) => (
      <span className="text-xs">{(getValue() as string | null) || "—"}</span>
    ),
  },
  {
    accessorKey: "planName",
    header: "Plan",
    cell: ({ getValue }) => <span className="text-xs">{getValue() as string}</span>,
  },
  {
    accessorKey: "billingCycle",
    header: "Billing",
    cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span>,
  },
  {
    accessorKey: "subscriptionStatus",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span>,
  },
  {
    accessorKey: "accessEndDate",
    header: "Access Ended",
    cell: ({ getValue }) =>
      getValue() ? (
        <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span>
    ),
  },
];
