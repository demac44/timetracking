import { cacheLife } from "next/cache";
import type { ApiResult } from "@/app/types/api";
import { getRateLimitedUntil } from "./client";
import { ApiError } from "./errors";

type SuccessProfile = "minutes" | "hours";

export async function toResult<T>(load: () => Promise<T>): Promise<ApiResult<T>> {
  try {
    return { ok: true, data: await load() };
  } catch (error) {
    if (error instanceof ApiError && error.status < 500 && error.status !== 429) {
      return { ok: false, status: error.status, message: error.message };
    }

    throw error;
  }
}

export function applyCacheLife(result: ApiResult<unknown>, profile: SuccessProfile) {
  if (!result.ok || profile === "minutes") {
    cacheLife("minutes");
  } else {
    cacheLife("hours");
  }
}

export function withRateLimit<A extends unknown[], T>(read: (...args: A) => Promise<ApiResult<T>>) {
  return async (...args: A): Promise<ApiResult<T>> => {
    try {
      return await read(...args);
    } catch (error) {
      const retryAt = getRateLimitedUntil();

      if (retryAt === null) {
        throw error;
      }

      return { ok: false, status: 429, message: "Too many requests to Memtime", retryAt };
    }
  };
}

export function unwrap<T>(result: ApiResult<T>): T {
  if (result.ok) {
    return result.data;
  }

  throw new ApiError(result.status, result.message, result.retryAt);
}
