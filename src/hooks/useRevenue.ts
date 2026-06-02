import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import { fetchRevenueHistory, fetchFailedPayments } from "@/lib/api/services";

export function useRevenueHistory(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: [...queryKeys.revenue.history(), { page, pageSize }],
    queryFn: () => fetchRevenueHistory(page, pageSize),
    staleTime: 5 * 60_000,
  });
}

export function useFailedPayments(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: [...queryKeys.revenue.failed(), { page, pageSize }],
    queryFn: () => fetchFailedPayments(page, pageSize),
    staleTime: 5 * 60_000,
  });
}

/** @deprecated Use useRevenueHistory() or useFailedPayments() directly */
export function useRevenue(type: "history" | "failed" = "history") {
  const history = useRevenueHistory();
  const failed = useFailedPayments();
  return type === "failed" ? failed : history;
}
