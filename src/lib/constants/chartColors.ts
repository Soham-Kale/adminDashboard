export const CHART_COLORS = {
  blue: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f97316",
  purple: "#a855f7",
  cyan: "#06b6d4",
  yellow: "#eab308",
  pink: "#ec4899",
  indigo: "#6366f1",
  teal: "#14b8a6",
} as const;

export const STATUS_COLORS = {
  active: CHART_COLORS.green,
  pending: CHART_COLORS.orange,
  cancelled_access_ended: CHART_COLORS.red,
  cancelled_access_active: CHART_COLORS.yellow,
  trial: CHART_COLORS.purple,
  trial_converted: CHART_COLORS.cyan,
} as const;

export const KPI_COLORS = {
  green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20", dot: "#22c55e" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", dot: "#3b82f6" },
  red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", dot: "#ef4444" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", dot: "#f97316" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", dot: "#a855f7" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", dot: "#06b6d4" },
  yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20", dot: "#eab308" },
} as const;

// Shared tooltip style — spread onto every <Tooltip {...TOOLTIP_STYLE} />
export const TOOLTIP_STYLE = {
  contentStyle: {
    background: "hsl(240 10% 5.9%)",
    border: "1px solid hsl(240 3.7% 15.9%)",
    borderRadius: 8,
    fontSize: 12,
    padding: "8px 12px",
    minWidth: 160,
  },
  labelStyle: { color: "hsl(0 0% 98%)", fontWeight: 600, marginBottom: 2 },
  itemStyle:  { color: "hsl(240 5% 64.9%)" },
  cursor:     { fill: "hsl(240 3.7% 15.9%)", opacity: 0.5 },
} as const;

export const PIE_TOOLTIP_STYLE = {
  contentStyle: {
    background: "hsl(240 10% 5.9%)",
    border: "1px solid hsl(240 3.7% 15.9%)",
    borderRadius: 8,
    fontSize: 12,
    padding: "8px 12px",
    minWidth: 180,
  },
  labelStyle: { color: "hsl(0 0% 98%)", fontWeight: 600 },
  itemStyle:  { color: "hsl(240 5% 64.9%)" },
} as const;

export const PIE_COLORS = [
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.purple,
  CHART_COLORS.orange,
  CHART_COLORS.cyan,
  CHART_COLORS.red,
  CHART_COLORS.yellow,
  CHART_COLORS.pink,
];
