"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchJson } from "@/app/lib/api/browser";
import { ApiError } from "@/app/lib/api/errors";
import type { FetchState } from "@/app/types/fetch";

interface FetchResult<T> {
  url: string;
  attempt: number;
  state: FetchState<T>;
}

const sessionCache = new Map<string, unknown>();

function toApiError(error: unknown) {
  return error instanceof ApiError ? error : new ApiError(0, "Something went wrong");
}

export function useFetch<T>(url: string | null, { cache = true }: { cache?: boolean } = {}) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<FetchResult<T> | null>(null);
  const isCached = url !== null && cache && sessionCache.has(url);

  useEffect(() => {
    if (url === null || isCached) {
      return;
    }

    let cancelled = false;

    fetchJson<T>(url).then(
      (data) => {
        if (cache) {
          sessionCache.set(url, data);
        }

        if (!cancelled) {
          setResult({ url, attempt, state: { status: "success", data } });
        }
      },
      (error) => {
        if (!cancelled) {
          setResult({ url, attempt, state: { status: "error", error: toApiError(error) } });
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [url, attempt, cache, isCached]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  let state: FetchState<T> | null = null;

  if (url !== null) {
    if (isCached) {
      state = { status: "success", data: sessionCache.get(url) as T };
    } else if (result?.url === url && result.attempt === attempt) {
      state = result.state;
    } else {
      state = { status: "loading" };
    }
  }

  return { state, retry };
}
