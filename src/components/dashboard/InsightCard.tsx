import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Info, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Insight } from "@/types/metrics";
import Link from "next/link";

const TYPE_CONFIG = {
  success: {
    icon: TrendingUp,
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    iconColor: "text-green-400",
    badgeClass: "bg-green-500/10 text-green-400",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
    badgeClass: "bg-yellow-500/10 text-yellow-400",
  },
  info: {
    icon: Info,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    badgeClass: "bg-blue-500/10 text-blue-400",
  },
  danger: {
    icon: AlertCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    iconColor: "text-red-400",
    badgeClass: "bg-red-500/10 text-red-400",
  },
};

interface InsightCardProps {
  insight: Insight;
  index?: number;
}

export function InsightCard({ insight, index = 0 }: InsightCardProps) {
  const config = TYPE_CONFIG[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={cn(
        "flex-shrink-0 w-72 rounded-xl border p-4",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-1.5 rounded-md bg-background/50")}>
          <Icon className={cn("h-4 w-4", config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{insight.title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.body}</p>
          {insight.metric && (
            <div className="flex items-center gap-2 mt-2">
              <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", config.badgeClass)}>
                {insight.metric}
              </span>
              {insight.change && (
                <span className="text-xs text-muted-foreground">{insight.change}</span>
              )}
            </div>
          )}
          {insight.action && insight.href && (
            <Link
              href={insight.href}
              className={cn("flex items-center gap-1 text-xs font-medium mt-2", config.iconColor, "hover:opacity-80 transition-opacity")}
            >
              {insight.action}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
