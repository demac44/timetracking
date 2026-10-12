import "server-only";

import type { ApiErrorResponse } from "@/app/types/api";
import { ApiError } from "./errors";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type QueryParams = Record<string, string | number | undefined>;

interface RequestOptions {
  method?: HttpMethod;
  query?: QueryParams;
  body?: unknown;
  reserve?: number;
}

const REQUEST_TIMEOUT_MS = 10_000;
const DEFAULT_RATE_LIMIT_WINDOW_S = 60;

let rateLimit = { remaining: Number.POSITIVE_INFINITY, resetAt: 0 };

function getConfig() {
  const baseUrl = process.env.API_BASE_URL;
  const token = process.env.API_TOKEN;

  if (!baseUrl || !token) {
    throw new Error("API_BASE_URL and API_TOKEN environment variables must be set");
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), token };
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams) {
  const url = new URL(`${baseUrl}${path}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

function trackRateLimit(headers: Headers) {
  const remaining = headers.get("ratelimit-remaining");
  const reset = headers.get("ratelimit-reset");

  if (remaining !== null && reset !== null) {
    rateLimit = { remaining: Number(remaining), resetAt: Date.now() + Number(reset) * 1000 };
  }
}

function getRetryAt(headers: Headers) {
  const seconds = Number(headers.get("ratelimit-reset") ?? headers.get("retry-after") ?? DEFAULT_RATE_LIMIT_WINDOW_S);
  return Date.now() + (Number.isFinite(seconds) ? seconds : DEFAULT_RATE_LIMIT_WINDOW_S) * 1000;
}

export function getRateLimitedUntil() {
  return Date.now() < rateLimit.resetAt && rateLimit.remaining <= 0 ? rateLimit.resetAt : null;
}

function assertBudget(reserve: number) {
  if (Date.now() < rateLimit.resetAt && rateLimit.remaining <= reserve) {
    throw new ApiError(429, "Request skipped to stay within the rate limit", rateLimit.resetAt);
  }
}

async function send(url: URL, init: RequestInit) {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ApiError(504, "The Memtime API took too long to respond");
    }

    throw new ApiError(503, "Couldn't reach the Memtime API");
  }
}

async function getErrorMessage(response: Response) {
  try {
    const data: ApiErrorResponse = await response.json();
    return data.error;
  } catch {
    return response.statusText;
  }
}

async function request<T>(path: string, { method = "GET", query, body, reserve = 0 }: RequestOptions = {}): Promise<T> {
  const { baseUrl, token } = getConfig();

  assertBudget(reserve);

  const response = await send(buildUrl(baseUrl, path, query), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  trackRateLimit(response.headers);

  if (!response.ok) {
    if (response.status === 429) {
      rateLimit = { remaining: 0, resetAt: getRetryAt(response.headers) };
    }

    throw new ApiError(
      response.status,
      await getErrorMessage(response),
      response.status === 429 ? rateLimit.resetAt : undefined,
    );
  }

  return response.json();
}

export const apiClient = {
  get: <T>(path: string, query?: QueryParams, reserve?: number) => request<T>(path, { query, reserve }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
