"use client";

import { useSyncExternalStore } from "react";
import type { Store } from "@/app/lib/store";

export function useStore<T>(store: Store<T>) {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
