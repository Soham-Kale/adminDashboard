import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import { fetchDashboardMetrics } from "@/lib/api/services";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: fetchDashboardMetrics,
    staleTime: 60_000,
    refetchInterval: 300_000,
  });
}
