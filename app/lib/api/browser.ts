import type { ApiErrorResponse } from "@/app/types/api";
import { ApiError } from "./errors";

type ErrorBody = ApiErrorResponse & { retryAt?: number };

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError(0, "Network request failed");
  }

  if (!response.ok) {
    const body: ErrorBody | null = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.error ?? response.statusText, body?.retryAt);
  }

  return response.json();
}
