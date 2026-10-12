"use client";

import { createStore } from "@/app/lib/store";
import type { TimeEntry } from "@/app/types/time-entry";

const HIGHLIGHT_MS = 2500;

const entriesById = new Map<number, TimeEntry>();

let currentPageIds: ReadonlySet<number> = new Set();

export const hiddenEntryIds = createStore<ReadonlySet<number>>(new Set());

export const highlightedEntryId = createStore<number | null>(null);

export function rememberEntries(entries: TimeEntry[]) {
  entries.forEach((entry) => entriesById.set(entry.id, entry));
}

export function setCurrentPage(entries: TimeEntry[]) {
  currentPageIds = new Set(entries.map((entry) => entry.id));
  rememberEntries(entries);
}

export function isOnCurrentPage(id: number) {
  return currentPageIds.has(id);
}

export function forgetEntry(id: number) {
  entriesById.delete(id);
}

export function getRememberedEntry(id: number) {
  return entriesById.get(id) ?? null;
}

export function getLatestRememberedEnd() {
  let latest: number | null = null;

  for (const entry of entriesById.values()) {
    const end = Date.parse(entry.end);
    latest = latest === null ? end : Math.max(latest, end);
  }

  return latest;
}

export function setEntryHidden(id: number, hidden: boolean) {
  hiddenEntryIds.set((current) => {
    const next = new Set(current);

    if (hidden) {
      next.add(id);
    } else {
      next.delete(id);
    }

    return next;
  });
}

export function releaseHiddenEntries(shouldRelease: (id: number) => boolean) {
  hiddenEntryIds.set((current) => {
    const next = new Set([...current].filter((id) => !shouldRelease(id)));
    return next.size === current.size ? current : next;
  });
}

export function highlightEntry(id: number) {
  highlightedEntryId.set(id);
  setTimeout(() => highlightedEntryId.set((current) => (current === id ? null : current)), HIGHLIGHT_MS);
}
