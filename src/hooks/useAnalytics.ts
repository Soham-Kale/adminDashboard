import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import { fetchAnalytics } from "@/lib/api/services";
import type { TimeRange } from "@/types/metrics";

export function useAnalytics(range?: TimeRange) {
  return useQuery({
    queryKey: range
      ? [...queryKeys.analytics.charts(), range]
      : queryKeys.analytics.charts(),
    queryFn: () => fetchAnalytics(range),
    staleTime: 5 * 60_000,
  });
}
