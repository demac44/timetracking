import "server-only";

import type { ApiErrorResponse } from "@/app/types/api";
import { ApiError } from "./errors";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type QueryParams = Record<string, string | number | undefined>;

interface RequestOptions {
  method?: HttpMethod;
  query?: QueryParams;
  body?: unknown;
}

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

async function getErrorMessage(response: Response) {
  try {
    const data: ApiErrorResponse = await response.json();
    return data.error;
  } catch {
    return response.statusText;
  }
}

async function request<T>(path: string, { method = "GET", query, body }: RequestOptions = {}): Promise<T> {
  const { baseUrl, token } = getConfig();

  const response = await fetch(buildUrl(baseUrl, path, query), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await getErrorMessage(response));
  }

  return response.json();
}

export const apiClient = {
  get: <T>(path: string, query?: QueryParams) => request<T>(path, { query }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
