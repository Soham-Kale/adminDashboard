import type { ColumnDef } from "@tanstack/react-table";
import type { Subscriber } from "@/types/subscription";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils/formatters";

export const trialUsersColumns: ColumnDef<Subscriber, unknown>[] = [
  {
    accessorKey: "userName",
    header: "Name",
    cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
  },
  {
    accessorKey: "trialStatus",
    header: "Trial",
    cell: ({ getValue }) => (
      <StatusBadge status={(getValue() as string) === "active" ? "trial" : "pending"} />
    ),
  },
  {
    accessorKey: "planName",
    header: "Plan",
    cell: ({ getValue }) => <span className="text-xs">{getValue() as string}</span>,
  },
  {
    accessorKey: "subscriptionStartDate",
    header: "Trial Started",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue() as string)}</span>
    ),
  },
  {
    accessorKey: "accessEndDate",
    header: "Trial Ends",
    cell: ({ getValue }) =>
      getValue() ? (
        <span className="text-xs text-orange-400">{formatDate(getValue() as string)}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ getValue }) => <span className="capitalize text-xs">{getValue() as string}</span>,
  },
];
