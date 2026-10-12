import type { ApiError } from "@/app/lib/api/errors";

export type FetchState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError };
