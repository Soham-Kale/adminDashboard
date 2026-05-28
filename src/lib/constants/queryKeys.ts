export const queryKeys = {
  dashboard: {
    all: ["dashboard"] as const,
    metrics: () => [...queryKeys.dashboard.all, "metrics"] as const,
  },
  subscribers: {
    all: ["subscribers"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.subscribers.all, "list", filters] as const,
    active: () => [...queryKeys.subscribers.all, "active"] as const,
    cancelled: () => [...queryKeys.subscribers.all, "cancelled"] as const,
    pending: () => [...queryKeys.subscribers.all, "pending"] as const,
    trials: () => [...queryKeys.subscribers.all, "trials"] as const,
  },
  users: {
    all: ["users"] as const,
    list: () => [...queryKeys.users.all, "list"] as const,
    onboarded: () => [...queryKeys.users.all, "onboarded"] as const,
  },
  revenue: {
    all: ["revenue"] as const,
    history: () => [...queryKeys.revenue.all, "history"] as const,
    failed: () => [...queryKeys.revenue.all, "failed"] as const,
    stats: () => [...queryKeys.revenue.all, "stats"] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    charts: () => [...queryKeys.analytics.all, "charts"] as const,
    heatmap: () => [...queryKeys.analytics.all, "heatmap"] as const,
  },
  logs: {
    all: ["logs"] as const,
    list: () => [...queryKeys.logs.all, "list"] as const,
  },
  notion: {
    all: ["notion"] as const,
    status: () => [...queryKeys.notion.all, "status"] as const,
  },
};
