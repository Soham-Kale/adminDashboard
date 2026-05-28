import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import apiClient from "@/lib/api/axios";
import type { Subscriber } from "@/types/subscription";
import type { ApiResponse } from "@/types/api";

export function useSubscribers(status?: string) {
  return useQuery({
    queryKey: status ? queryKeys.subscribers.list({ status }) : queryKeys.subscribers.list(),
    queryFn: async () => {
      const url = status ? `/api/subscriptions?status=${status}` : "/api/subscriptions";
      const res = await apiClient.get<ApiResponse<Subscriber[]>>(url);
      return res.data;
    },
    staleTime: 2 * 60_000,
  });
}
