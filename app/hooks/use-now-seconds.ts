"use client";

import { useSyncExternalStore } from "react";

function subscribeEverySecond(callback: () => void) {
  const interval = setInterval(callback, 1000);
  return () => clearInterval(interval);
}

export function useNowSeconds() {
  return useSyncExternalStore(
    subscribeEverySecond,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}
