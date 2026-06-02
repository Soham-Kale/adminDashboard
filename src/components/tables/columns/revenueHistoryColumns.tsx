"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { RevenueRecord } from "@/types/revenue";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils/formatters";
import { useCurrency } from "@/hooks/useCurrency";

// Cell component so the hook can be called inside a React component
function AmountCell({ amount, currency }: { amount: number; currency: string }) {
  const { formatRevenue } = useCurrency();
  return (
    <span className="text-green-400 font-semibold">
      {formatRevenue(amount, currency)}
    </span>
  );
}

export const revenueHistoryColumns: ColumnDef<RevenueRecord, unknown>[] = [
  {
    accessorKey: "userSubscriptionId",
    header: "Subscription",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">{String(getValue())}</span>
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
    cell: ({ getValue, row }) => (
      <AmountCell amount={getValue() as number} currency={row.original.currency} />
    ),
  },
  {
    accessorKey: "currency",
    header: "Orig. Currency",
    cell: ({ getValue }) => (
      <span className="text-xs font-mono text-muted-foreground">{getValue() as string}</span>
    ),
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
