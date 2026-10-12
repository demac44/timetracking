"use client";

import { RotateCwIcon } from "lucide-react";
import { RateLimitCountdown } from "@/app/components/shared/rate-limit-countdown";
import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useRetryCountdown } from "@/app/hooks/use-retry-countdown";
import { describeApiError } from "@/app/lib/api/error-message";
import type { FetchState } from "@/app/types/fetch";

interface ListStateProps<T> {
  state: FetchState<T> | null;
  onRetry: () => void;
}

export function ListState<T>({ state, onRetry }: ListStateProps<T>) {
  const retryAt = state?.status === "error" ? state.error.retryAt : undefined;
  const { isWaiting } = useRetryCountdown(retryAt);

  if (state?.status === "loading") {
    return (
      <div className="space-y-2 p-2" aria-label="Loading">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-5/6" />
        <Skeleton className="h-7 w-2/3" />
      </div>
    );
  }

  if (state?.status === "error") {
    return (
      <div className="flex flex-col items-start gap-2 p-3 text-sm">
        <p className="text-destructive">
          {describeApiError(state.error.status, state.error.message)}{" "}
          {state.error.status === 429 && <RateLimitCountdown retryAt={retryAt} />}
        </p>
        <Button type="button" variant="outline" size="xs" disabled={isWaiting} onClick={onRetry}>
          <RotateCwIcon data-icon="inline-start" />
          Retry
        </Button>
      </div>
    );
  }

  return null;
}
