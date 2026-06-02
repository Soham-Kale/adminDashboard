"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import { fetchSyncStatus, triggerSync } from "@/lib/api/services";
import { CheckCircle2, XCircle, RefreshCw, Database, Zap, Key, FileText } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";
import { formatRelativeDate } from "@/lib/utils/formatters";

export default function IntegrationsPage() {
  const queryClient = useQueryClient();

  const { data: statusData } = useQuery({
    queryKey: queryKeys.notion.status(),
    queryFn: fetchSyncStatus,
  });

  const syncMutation = useMutation({
    mutationFn: triggerSync,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: queryKeys.notion.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.subscribers.all });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Sync failed. Please check your Notion credentials."),
  });

  const isConnected = statusData?.connected;
  const source = statusData?.source ?? "mock";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-muted">
              <Database className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Notion Database</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Connect your Notion subscription database</p>
            </div>
          </div>
          <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
            isConnected
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-orange-500/10 text-orange-400 border-orange-500/20"
          )}>
            {isConnected ? (
              <><CheckCircle2 className="h-3 w-3" /> Connected</>
            ) : (
              <><XCircle className="h-3 w-3" /> Using Mock Data</>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Data Source</p>
            <p className="font-medium text-foreground capitalize">{source}</p>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Database ID</p>
            <p className="font-mono text-xs text-foreground">
              {statusData?.databaseId ?? "Not configured"}
            </p>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Last Synced</p>
            <p className="text-foreground">
              {statusData?.lastSynced ? formatRelativeDate(statusData.lastSynced) : "Never"}
            </p>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Auto-refresh</p>
            <p className="text-foreground">Every 5 minutes</p>
          </div>
        </div>

        <button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", syncMutation.isPending && "animate-spin")} />
          {syncMutation.isPending ? "Syncing…" : "Sync Now"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Configuration</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Add these variables to your <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">.env.local</code> file to connect to Notion:
        </p>
        <div className="bg-background border border-border rounded-lg p-4 font-mono text-xs space-y-1 text-muted-foreground">
          <p><span className="text-blue-400">NOTION_API_KEY</span>=<span className="text-green-400">secret_xxxx</span></p>
          <p><span className="text-blue-400">NOTION_DATABASE_ID</span>=<span className="text-green-400">your-database-id</span></p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Expected Notion Schema</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            "User Name", "Email", "Plan Type", "Subscription Status",
            "Trial Status", "Subscription Start Date", "Renewal Date",
            "Cancellation Date", "Access End Date", "Revenue",
            "Country", "Device Type", "Referral Source", "Payment Status",
          ].map((field) => (
            <div key={field} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {field}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-yellow-400" />
          <h3 className="font-semibold text-foreground">Other Integrations</h3>
          <span className="text-xs text-muted-foreground ml-auto">Coming soon</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Stripe", "Paddle", "LemonSqueezy", "Mixpanel", "Segment", "Amplitude"].map((name) => (
            <div key={name} className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg opacity-50">
              <div className="h-6 w-6 rounded bg-muted" />
              <span className="text-xs font-medium text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
