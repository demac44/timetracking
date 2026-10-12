"use client";

import { useEffect } from "react";
import {
  hiddenEntryIds,
  highlightedEntryId,
  releaseHiddenEntries,
  rememberEntries,
} from "@/app/components/time-entries/lib/entry-store";
import { isDeletePending } from "@/app/components/time-entries/lib/pending-deletes";
import { useStore } from "@/app/hooks/use-store";
import type { TimeEntry } from "@/app/types/time-entry";

export function useVisibleEntries(entries: TimeEntry[]) {
  const hiddenIds = useStore(hiddenEntryIds);
  const highlightedId = useStore(highlightedEntryId);

  useEffect(() => {
    rememberEntries(entries);

    const presentIds = new Set(entries.map((entry) => entry.id));
    releaseHiddenEntries((id) => !presentIds.has(id) && !isDeletePending(id));
  }, [entries]);

  useEffect(() => {
    if (highlightedId !== null) {
      document.getElementById(`entry-row-${highlightedId}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedId]);

  return {
    visibleEntries: entries.filter((entry) => !hiddenIds.has(entry.id)),
    highlightedId,
  };
}
