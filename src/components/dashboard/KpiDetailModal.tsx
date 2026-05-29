"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend,
} from "recharts";
import {
  UserPlus, Clock, UserMinus, UserCheck, CreditCard, Users, XCircle,
  UserCog, DollarSign, Shield, BarChart2, Activity, Users2,
} from "lucide-react";
import { MetricTimeFilter } from "./MetricTimeFilter";
import { DataTable } from "@/components/tables/DataTable";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { getMetricChartData, getChartTypeForMetric, getReferenceLineForMetric } from "@/lib/utils/metricChartData";
import { CHART_COLORS, KPI_COLORS } from "@/lib/constants/chartColors";
import { cn } from "@/lib/utils/cn";
import type { KpiMetric, DashboardMetrics, TimeRange, MetricTableRow } from "@/types/metrics";
import type { ColumnDef } from "@tanstack/react-table";
import { useAnalytics } from "@/hooks/useAnalytics";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  UserPlus, Clock, UserMinus, UserCheck, CreditCard, Users, XCircle,
  UserCog, DollarSign, Shield, BarChart2, Activity, Users2,
  TrendingUp, TrendingDown,
};

const TOOLTIP_STYLE = {
  background: "hsl(240 10% 5.9%)",
  border: "1px solid hsl(240 3.7% 15.9%)",
  borderRadius: 8,
  fontSize: 12,
};

const tableColumns: ColumnDef<MetricTableRow, unknown>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => <span className="text-xs font-mono text-muted-foreground">{getValue() as string}</span>,
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ getValue }) => <span className="font-semibold text-foreground">{(getValue() as number).toLocaleString()}</span>,
  },
  {
    accessorKey: "delta",
    header: "Day Change",
    cell: ({ row }) => {
      const { delta, deltaDirection } = row.original;
      const color = deltaDirection === "up" ? "text-green-400" : deltaDirection === "down" ? "text-red-400" : "text-muted-foreground";
      const sign = delta > 0 ? "+" : "";
      return <span className={cn("text-xs font-medium", color)}>{sign}{delta}%</span>;
    },
  },
];

interface KpiDetailModalProps {
  metricId: string;
  metrics: DashboardMetrics;
  onClose: () => void;
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 bg-background rounded-lg p-3 text-center border border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

export function KpiDetailModal({ metricId, metrics, onClose }: KpiDetailModalProps) {
  const [range, setRange] = useState<TimeRange>("1m");
  const { data: analyticsData } = useAnalytics();
  const dailyData = analyticsData?.data?.daily ?? [];

  const metricsMap = metrics as unknown as Record<string, KpiMetric>;
  const metric: KpiMetric = metricsMap[
    Object.keys(metricsMap).find((k) => metricsMap[k].id === metricId) ?? ""
  ];

  const chartResult = getMetricChartData(metricId, range, dailyData);
  const chartType = getChartTypeForMetric(metricId);
  const refLine = getReferenceLineForMetric(metricId);

  const colors = metric ? KPI_COLORS[metric.color] : KPI_COLORS.blue;
  const Icon = metric ? (ICON_MAP[metric.icon] ?? BarChart2) : BarChart2;

  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [handleEscape]);

  if (!metric) return null;

  const formatValue = (v: number) => {
    if (metric.displayValue.includes("$")) return `$${v.toLocaleString()}`;
    if (metric.displayValue.includes("%")) return `${v}%`;
    return v.toLocaleString();
  };

  const overlapChartData = chartResult.primary.map((p, i) => ({
    date: p.date,
    current: p.value,
    prior: chartResult.overlap[1]?.data[i]?.value ?? 0,
    avg6m: chartResult.overlap[2]?.data[i]?.value ?? 0,
  }));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative w-full sm:max-w-4xl max-h-[92vh] bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", colors.bg)}>
                <Icon className={cn("h-5 w-5", colors.text)} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{metric.label}</h2>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{metric.displayValue}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {metric.deltaDirection === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  ) : metric.deltaDirection === "down" ? (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  ) : (
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={cn("text-xs font-medium",
                    metric.deltaDirection === "up" ? "text-green-400"
                    : metric.deltaDirection === "down" ? "text-red-400"
                    : "text-muted-foreground"
                  )}>
                    {metric.delta > 0 ? "+" : ""}{metric.delta}%
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-5">
            {/* Time filter */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Trend Analysis</h3>
              <MetricTimeFilter value={range} onChange={setRange} />
            </div>

            {/* Primary chart */}
            <div className="bg-background rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground mb-3">
                {metric.label} — last {range === "1w" ? "7 days" : range === "1m" ? "30 days" : range === "6m" ? "6 months" : "1 year"}
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "area" ? (
                    <AreaChart data={chartResult.primary} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                      <defs>
                        <linearGradient id="modalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.dot} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={colors.dot} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} interval={Math.floor(chartResult.primary.length / 6)} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatValue(v)} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [formatValue(Number(v)), metric.label]} />
                      {refLine !== null && <ReferenceLine y={refLine} stroke={CHART_COLORS.yellow} strokeDasharray="4 2" label={{ value: `Target ${refLine}`, fill: "hsl(240 5% 64.9%)", fontSize: 10 }} />}
                      <Area type="monotone" dataKey="value" stroke={colors.dot} fill="url(#modalGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  ) : chartType === "bar" ? (
                    <BarChart data={chartResult.primary} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} interval={Math.floor(chartResult.primary.length / 6)} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatValue(v)} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [formatValue(Number(v)), metric.label]} />
                      <Bar dataKey="value" fill={colors.dot} radius={[3, 3, 0, 0]} fillOpacity={0.85} />
                    </BarChart>
                  ) : (
                    <LineChart data={chartResult.primary} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} interval={Math.floor(chartResult.primary.length / 6)} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatValue(v)} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [formatValue(Number(v)), metric.label]} />
                      {refLine !== null && <ReferenceLine y={refLine} stroke={CHART_COLORS.yellow} strokeDasharray="4 2" label={{ value: `Target ${refLine}`, fill: "hsl(240 5% 64.9%)", fontSize: 10 }} />}
                      <Line type="monotone" dataKey="value" stroke={colors.dot} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats strip */}
            <div className="flex gap-3">
              <StatTile label="Period High" value={formatValue(chartResult.stats.high)} />
              <StatTile label="Period Low" value={formatValue(chartResult.stats.low)} />
              <StatTile label="Average" value={formatValue(chartResult.stats.avg)} />
              <StatTile label="Total" value={formatValue(chartResult.stats.total)} />
            </div>

            {/* Overlap chart */}
            <div className="bg-background rounded-xl border border-border p-4">
              <p className="text-xs font-semibold text-foreground mb-1">Period Comparison</p>
              <p className="text-xs text-muted-foreground mb-3">Current vs Prior period vs 6-month average</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overlapChartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} interval={Math.floor(overlapChartData.length / 5)} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 64.9%)" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="current" stroke={CHART_COLORS.blue} strokeWidth={2} dot={false} name="Current Period" />
                    <Line type="monotone" dataKey="prior" stroke={CHART_COLORS.purple} strokeWidth={2} dot={false} strokeDasharray="4 2" name="Prior Period" strokeOpacity={0.7} />
                    <Line type="monotone" dataKey="avg6m" stroke={CHART_COLORS.orange} strokeWidth={1.5} dot={false} strokeDasharray="2 4" name="6M Average" strokeOpacity={0.6} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Data table */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Daily Breakdown</p>
              <DataTable
                columns={tableColumns as never}
                data={[...chartResult.tableRows].reverse()}
                pageSize={7}
                toolbar={(table) => (
                  <TableToolbar
                    table={table}
                    exportFilename={`${metricId}-${range}`}
                    placeholder="Search dates…"
                  />
                )}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
