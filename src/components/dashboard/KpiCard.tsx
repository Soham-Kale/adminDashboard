"use client";

import { motion } from "framer-motion";
import {
  UserPlus, Clock, UserMinus, UserCheck, CreditCard, Users, XCircle,
  UserCog, DollarSign, TrendingUp, TrendingDown, Shield, BarChart2,
  Activity, Users2, UserX, Maximize2,
} from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { KPI_COLORS } from "@/lib/constants/chartColors";
import { cn } from "@/lib/utils/cn";
import type { KpiMetric } from "@/types/metrics";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  UserPlus, Clock, UserMinus, UserCheck, CreditCard, Users, XCircle,
  UserCog, DollarSign, TrendingUp, TrendingDown, Shield, BarChart2,
  Activity, Users2, UserX,
};

interface KpiCardProps {
  metric: KpiMetric;
  index?: number;
  onClick?: () => void;
}

export function KpiCard({ metric, index = 0, onClick }: KpiCardProps) {
  const Icon = ICON_MAP[metric.icon] ?? BarChart2;
  const colors = KPI_COLORS[metric.color];
  const sparkData = metric.sparklineData?.map((v, i) => ({ i, v })) ?? [];

  // Revenue: value is now { INR?: number, CAD?: number, USD?: number }
  // Backend provides a pre-formatted displayValue string e.g. "INR $422,161 | CAD $540"
  const isRevenue = metric.id === "revenue";

  // For non-revenue metrics: animate the number
  const numericValue = !isRevenue
    ? typeof metric.value === "number" ? metric.value : parseFloat(String(metric.value)) || 0
    : 0;
  const hasPercentSuffix = !isRevenue && metric.displayValue.includes("%");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group relative overflow-hidden",
        onClick && "cursor-pointer hover:ring-1 hover:ring-primary/20"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {onClick && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Maximize2 className="h-3 w-3 text-muted-foreground" />
        </div>
      )}

      <div className="flex items-start justify-between mb-3 relative">
        <div className={cn("p-2 rounded-lg", colors.bg)}>
          <Icon className={cn("h-4 w-4", colors.text)} />
        </div>
        <TrendIndicator
          delta={Math.abs(metric.delta)}
          direction={metric.deltaDirection}
          showIcon={true}
        />
      </div>

      <div className="relative">
        <div className="flex items-end gap-1">
          {isRevenue ? (
            // Revenue: use backend's pre-formatted displayValue directly
            <span className="text-lg font-bold text-foreground leading-none break-all">
              {metric.displayValue}
            </span>
          ) : (
            <span className="text-2xl font-bold text-foreground leading-none">
              <AnimatedNumber
                value={numericValue}
                suffix={hasPercentSuffix ? "%" : ""}
              />
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-foreground mt-1">{metric.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{metric.description}</p>
      </div>

      {sparkData.length > 0 && (
        <div className="mt-3 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={colors.dot}
                strokeWidth={1.5}
                dot={false}
                strokeOpacity={0.6}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
