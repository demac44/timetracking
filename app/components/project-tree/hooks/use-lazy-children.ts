"use client";

import { useCallback, useState } from "react";
import type { ChildrenState } from "@/app/components/project-tree/types/tree";
import { fetchJson } from "@/app/lib/api/browser";
import { ApiError } from "@/app/lib/api/errors";

function toApiError(error: unknown) {
  return error instanceof ApiError ? error : new ApiError(0, "Something went wrong");
}

export function useLazyChildren<T>(buildUrl: (parentId: number) => string) {
  const [children, setChildren] = useState<Record<number, ChildrenState<T>>>({});

  const load = useCallback(
    async (parentId: number) => {
      setChildren((current) => ({ ...current, [parentId]: { status: "loading" } }));

      try {
        const items = await fetchJson<T[]>(buildUrl(parentId));
        setChildren((current) => ({ ...current, [parentId]: { status: "ready", items } }));
      } catch (error) {
        setChildren((current) => ({ ...current, [parentId]: { status: "error", error: toApiError(error) } }));
      }
    },
    [buildUrl],
  );

  return { children, load };
}
