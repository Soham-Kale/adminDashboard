import { cn } from "@/lib/utils/cn";
import type { SubscriptionStatus, PaymentStatus } from "@/types/subscription";

type Status = SubscriptionStatus | PaymentStatus | string;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  // Subscription statuses (real backend values)
  active:    { label: "Active",    className: "bg-green-500/10 text-green-400 border-green-500/20" },
  trial:     { label: "Trial",     className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  pending:   { label: "Pending",   className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  paused:    { label: "Paused",    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  expired:   { label: "Expired",   className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  // Payment statuses
  paid:      { label: "Paid",      className: "bg-green-500/10 text-green-400 border-green-500/20" },
  failed:    { label: "Failed",    className: "bg-red-500/10 text-red-400 border-red-500/20" },
  // Misc
  success:   { label: "Success",   className: "bg-green-500/10 text-green-400 border-green-500/20" },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status.replace(/_/g, " "),
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
