import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import apiClient from "@/lib/api/axios";
import type { TimeRange } from "@/types/metrics";

export function useAnalytics(range?: TimeRange) {
  return useQuery({
    queryKey: range ? [...queryKeys.analytics.charts(), range] : queryKeys.analytics.charts(),
    queryFn: async () => {
      const url = range ? `/api/analytics?range=${range}` : "/api/analytics";
      const res = await apiClient.get(url);
      return res.data;
    },
    staleTime: 5 * 60_000,
  });
}
