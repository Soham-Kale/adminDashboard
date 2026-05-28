"use client";

import { useRevenue } from "@/hooks/useRevenue";
import { useAnalytics } from "@/hooks/useAnalytics";
import { DataTable } from "@/components/tables/DataTable";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { revenueHistoryColumns } from "@/components/tables/columns/revenueHistoryColumns";
import { failedPaymentsColumns } from "@/components/tables/columns/failedPaymentsColumns";
import { MonthlyRevenueAnalytics } from "@/components/charts/MonthlyRevenueAnalytics";
import { RevenueForecast } from "@/components/charts/RevenueForecast";
import { RevenueGrowthBar } from "@/components/charts/RevenueGrowthBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatCurrency } from "@/lib/utils/formatters";
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function RevenuePage() {
  const { data: revenueData, isLoading } = useRevenue("history");
  const { data: failedData, isLoading: failedLoading } = useRevenue("failed");
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  const stats = revenueData?.stats;
  const analyticsData = analytics?.data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Monthly Revenue" value={stats ? formatCurrency(stats.mrr) : "$2,300"} icon={DollarSign} color="bg-green-500/10 text-green-400" />
        <StatCard label="Annual Revenue" value={stats ? formatCurrency(stats.arr) : "$27,600"} icon={TrendingUp} color="bg-blue-500/10 text-blue-400" />
        <StatCard label="Avg. Per User" value={stats ? formatCurrency(stats.averageRevenuePerUser) : "$100"} icon={CreditCard} color="bg-purple-500/10 text-purple-400" />
        <StatCard label="Growth Rate" value={stats ? `${stats.revenueGrowth}%` : "12%"} icon={TrendingUp} color="bg-orange-500/10 text-orange-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MonthlyRevenueAnalytics
          data={analyticsData?.monthly ?? []}
          isLoading={analyticsLoading}
        />
        <RevenueForecast
          data={analyticsData?.monthly}
          isLoading={analyticsLoading}
        />
      </div>

      <RevenueGrowthBar
        data={analyticsData?.monthly}
        isLoading={analyticsLoading}
      />

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Revenue History</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <DataTable
            columns={revenueHistoryColumns as never}
            data={revenueData?.data ?? []}
            toolbar={(table) => (
              <TableToolbar table={table} exportFilename="revenue-history" placeholder="Search payments…" />
            )}
          />
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-semibold text-foreground">Failed Payments</h3>
          <span className="text-xs text-muted-foreground">({failedData?.data?.length ?? 0} records)</span>
        </div>
        {failedLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <DataTable
            columns={failedPaymentsColumns as never}
            data={failedData?.data ?? []}
            toolbar={(table) => (
              <TableToolbar table={table} exportFilename="failed-payments" placeholder="Search failed payments…" />
            )}
          />
        )}
      </div>
    </div>
  );
}
