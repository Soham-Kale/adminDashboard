import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface TrendIndicatorProps {
  delta: number;
  direction: "up" | "down" | "neutral";
  className?: string;
  showIcon?: boolean;
  isInverse?: boolean;
}

export function TrendIndicator({
  delta,
  direction,
  className,
  showIcon = true,
  isInverse = false,
}: TrendIndicatorProps) {
  const isPositive = isInverse ? direction === "down" : direction === "up";
  const isNeutral = direction === "neutral";

  const colorClass = isNeutral
    ? "text-muted-foreground"
    : isPositive
    ? "text-green-400"
    : "text-red-400";

  const sign = delta > 0 ? "+" : "";

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", colorClass, className)}>
      {showIcon && !isNeutral && (
        direction === "up" ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )
      )}
      {showIcon && isNeutral && <Minus className="h-3 w-3" />}
      {sign}{Math.abs(delta).toFixed(1)}%
    </span>
  );
}
