import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import { fetchSubscriptions } from "@/lib/api/services";
import type { SubscriptionParams } from "@/lib/api/services";

export function useSubscribers(status?: string, params?: Omit<SubscriptionParams, "status">) {
  return useQuery({
    queryKey: status
      ? queryKeys.subscribers.list({ status, ...params })
      : queryKeys.subscribers.list(params),
    queryFn: () => fetchSubscriptions({ status, ...params }),
    staleTime: 2 * 60_000,
  });
}
