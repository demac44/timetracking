"use client";

import { useEffect } from "react";
import { isDeleteInFlight } from "@/app/components/time-entries/lib/delete-with-undo";
import {
  hiddenEntryIds,
  highlightedEntryId,
  isOnCurrentPage,
  releaseHiddenEntries,
  setCurrentPage,
} from "@/app/components/time-entries/lib/entry-store";
import { useStore } from "@/app/hooks/use-store";
import type { TimeEntry } from "@/app/types/time-entry";

export function useVisibleEntries(entries: TimeEntry[]) {
  const hiddenIds = useStore(hiddenEntryIds);
  const highlightedId = useStore(highlightedEntryId);

  useEffect(() => {
    setCurrentPage(entries);
    releaseHiddenEntries((id) => !isOnCurrentPage(id) && !isDeleteInFlight(id));
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
