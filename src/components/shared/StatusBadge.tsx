import { cn } from "@/lib/utils/cn";
import type { SubscriptionStatus, PaymentStatus } from "@/types/subscription";

type Status = SubscriptionStatus | PaymentStatus | string;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-500/10 text-green-400 border-green-500/20" },
  pending: { label: "Pending", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  cancelled_access_ended: { label: "Cancelled", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  cancelled_access_active: { label: "Cancelling", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  trial: { label: "Trial", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  trial_converted: { label: "Converted", className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  paid: { label: "Paid", className: "bg-green-500/10 text-green-400 border-green-500/20" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  refunded: { label: "Refunded", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  success: { label: "Success", className: "bg-green-500/10 text-green-400 border-green-500/20" },
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
