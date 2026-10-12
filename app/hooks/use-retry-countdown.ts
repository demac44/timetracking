"use client";

import { useNowSeconds } from "./use-now-seconds";

function getSecondsLeft(retryAt: number | undefined, nowSeconds: number | null) {
  if (!retryAt || nowSeconds === null) {
    return null;
  }

  return Math.max(0, Math.ceil(retryAt / 1000) - nowSeconds);
}

export function useRetryCountdown(retryAt: number | undefined) {
  const secondsLeft = getSecondsLeft(retryAt, useNowSeconds());
  return { secondsLeft, isWaiting: secondsLeft !== null && secondsLeft > 0 };
}
