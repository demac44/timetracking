"use client";

import { useRetryCountdown } from "@/app/hooks/use-retry-countdown";

export function RateLimitCountdown({ retryAt }: { retryAt?: number }) {
  const { secondsLeft, isWaiting } = useRetryCountdown(retryAt);

  if (!isWaiting) {
    return <span>You can try again now.</span>;
  }

  return (
    <span aria-live="off" className="tabular-nums">
      Try again in {secondsLeft}s.
    </span>
  );
}
