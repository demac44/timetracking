export type SortOrder = "asc" | "desc";

export type EntityStatus = "pending" | "in-progress" | "completed";

export type PaginationParams<T> = {
  limit?: number;
  offset?: number;
  sortBy?: keyof T;
  order?: SortOrder;
};

export interface ApiErrorResponse {
  error: string;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; retryAt?: number };
