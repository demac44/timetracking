"use client";

import { RotateCwIcon } from "lucide-react";
import type { ChildrenState } from "@/app/components/project-tree/types/tree";
import { RateLimitCountdown } from "@/app/components/shared/rate-limit-countdown";
import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useRetryCountdown } from "@/app/hooks/use-retry-countdown";
import { describeApiError } from "@/app/lib/api/error-message";
import { cn } from "@/app/lib/utils";

interface ChildrenStatusProps<T> {
  state: ChildrenState<T> | undefined;
  level: 2 | 3;
  emptyLabel: string;
  onRetry: () => void;
}

export function ChildrenStatus<T>({ state, level, emptyLabel, onRetry }: ChildrenStatusProps<T>) {
  const retryAt = state?.status === "error" ? state.error.retryAt : undefined;
  const { isWaiting } = useRetryCountdown(retryAt);
  const padding = cn("py-1.5 pr-2 text-xs", level === 2 ? "pl-12" : "pl-[4.25rem]");

  if (!state || state.status === "loading") {
    return (
      <li role="none" className={cn(padding, "space-y-2")}>
        <span className="sr-only">Loading…</span>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </li>
    );
  }

  if (state.status === "error") {
    return (
      <li role="none" className={cn(padding, "flex flex-wrap items-center gap-x-2 gap-y-1 text-destructive")}>
        <span>{describeApiError(state.error.status, state.error.message)}</span>
        {state.error.status === 429 && <RateLimitCountdown retryAt={retryAt} />}
        <Button variant="outline" size="xs" disabled={isWaiting} onClick={onRetry}>
          <RotateCwIcon data-icon="inline-start" />
          Retry
        </Button>
      </li>
    );
  }

  if (state.items.length === 0) {
    return (
      <li role="none" className={cn(padding, "text-muted-foreground")}>
        {emptyLabel}
      </li>
    );
  }

  return null;
}
