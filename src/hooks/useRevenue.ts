import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import apiClient from "@/lib/api/axios";

export function useRevenue(type: "history" | "failed" = "history") {
  return useQuery({
    queryKey: type === "failed" ? queryKeys.revenue.failed() : queryKeys.revenue.history(),
    queryFn: async () => {
      const res = await apiClient.get(`/api/revenue?type=${type}`);
      return res.data;
    },
    staleTime: 5 * 60_000,
  });
}
