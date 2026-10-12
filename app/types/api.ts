export type SortOrder = "asc" | "desc";

export interface PaginationParams<T> {
  limit?: number;
  offset?: number;
  sortBy?: keyof T;
  order?: SortOrder;
}

export interface ApiErrorResponse {
  error: string;
}
