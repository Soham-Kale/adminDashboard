import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import apiClient from "@/lib/api/axios";

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.charts(),
    queryFn: async () => {
      const res = await apiClient.get("/api/analytics");
      return res.data;
    },
    staleTime: 5 * 60_000,
  });
}
