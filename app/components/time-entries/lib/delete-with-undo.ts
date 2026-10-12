"use client";

import { toast } from "sonner";
import { deleteTimeEntries, saveTimeEntry } from "@/app/actions/time-entries";
import type { TimeEntry } from "@/app/types/time-entry";
import { forgetEntry, highlightEntry, isOnCurrentPage, rememberEntries, setEntryHidden } from "./entry-store";

const UNDO_DURATION_MS = 8000;

const deletions = new Map<number, Promise<boolean>>();

export function isDeleteInFlight(id: number) {
  return deletions.has(id);
}

function keepEntry(id: number, message: string) {
  setEntryHidden(id, false);
  toast.error(`Couldn't delete time entry #${id}`, { description: message });
}

async function removeEntry(id: number) {
  try {
    const { failed } = await deleteTimeEntries([id]);

    if (failed.length > 0) {
      keepEntry(id, failed[0].message);
      return false;
    }

    forgetEntry(id);
    return true;
  } catch {
    keepEntry(id, "Couldn't reach Memtime. The entry was kept.");
    return false;
  } finally {
    deletions.delete(id);

    if (!isOnCurrentPage(id)) {
      setEntryHidden(id, false);
    }
  }
}

async function restoreEntry(entry: TimeEntry, deletion: Promise<boolean>) {
  if (!(await deletion)) {
    return;
  }

  const { taskId, comment, start, end } = entry;
  const result = await saveTimeEntry(null, { taskId, comment, start, end });

  if (result.status === "error") {
    toast.error("Couldn't restore the time entry", { description: result.message });
    return;
  }

  const restored = result.entry;
  setEntryHidden(restored.id, false);
  rememberEntries([restored]);
  highlightEntry(restored.id);
  toast.success(
    restored.id === entry.id ? `Time entry #${restored.id} restored` : `Time entry restored as #${restored.id}`,
  );
}

export function deleteWithUndo(entry: TimeEntry) {
  if (deletions.has(entry.id)) {
    return;
  }

  setEntryHidden(entry.id, true);

  const deletion = removeEntry(entry.id);
  deletions.set(entry.id, deletion);

  toast(`Time entry #${entry.id} deleted`, {
    description: entry.comment,
    duration: UNDO_DURATION_MS,
    action: { label: "Undo", onClick: () => void restoreEntry(entry, deletion) },
  });
}
