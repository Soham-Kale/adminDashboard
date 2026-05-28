import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import apiClient from "@/lib/api/axios";
import type { DashboardMetrics } from "@/types/metrics";
import type { ApiResponse } from "@/types/api";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<DashboardMetrics>>("/api/dashboard");
      return res.data;
    },
    staleTime: 60_000,
    refetchInterval: 300_000,
  });
}
