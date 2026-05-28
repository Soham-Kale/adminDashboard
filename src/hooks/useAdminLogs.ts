import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/queryKeys";
import apiClient from "@/lib/api/axios";

export function useAdminLogs() {
  return useQuery({
    queryKey: queryKeys.logs.list(),
    queryFn: async () => {
      const res = await apiClient.get("/api/admin-logs");
      return res.data;
    },
    staleTime: 60_000,
  });
}
