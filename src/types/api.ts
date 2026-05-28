export interface ApiResponse<T> {
  data: T;
  meta: {
    source: "mock" | "notion";
    total?: number;
    page?: number;
    pageSize?: number;
    lastSynced?: string;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface DateRangeParams {
  from?: string;
  to?: string;
}
