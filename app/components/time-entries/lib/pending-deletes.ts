"use client";

import { toast } from "sonner";
import { deleteTimeEntries } from "@/app/actions/time-entries";
import type { TimeEntry } from "@/app/types/time-entry";
import { forgetEntry, setEntryHidden } from "./entry-store";

const UNDO_WINDOW_MS = 6000;

const pending = new Map<number, { timer: ReturnType<typeof setTimeout>; toastId: string | number }>();
const committing = new Set<number>();

let listensForPageHide = false;

function flushPendingDeletes() {
  for (const [id, { timer }] of pending) {
    clearTimeout(timer);
    void fetch(`/api/v1/time-entries/${id}`, { method: "DELETE", keepalive: true });
  }

  pending.clear();
}

function restore(id: number, message: string) {
  setEntryHidden(id, false);
  toast.error(`Couldn't delete time entry #${id}`, { description: message });
}

async function commitDelete(id: number) {
  const item = pending.get(id);

  if (!item) {
    return;
  }

  pending.delete(id);
  committing.add(id);
  toast.dismiss(item.toastId);

  try {
    const { failed } = await deleteTimeEntries([id]);

    if (failed.length > 0) {
      restore(id, failed[0].message);
    } else {
      forgetEntry(id);
    }
  } catch {
    restore(id, "Couldn't reach Memtime. The entry was kept.");
  } finally {
    committing.delete(id);
  }
}

export function isDeletePending(id: number) {
  return pending.has(id) || committing.has(id);
}

function undoDelete(id: number) {
  const item = pending.get(id);

  if (!item) {
    return;
  }

  clearTimeout(item.timer);
  pending.delete(id);
  setEntryHidden(id, false);
  toast.success(`Time entry #${id} restored`);
}

export function deleteWithUndo(entry: TimeEntry) {
  if (pending.has(entry.id)) {
    return;
  }

  if (!listensForPageHide) {
    window.addEventListener("pagehide", flushPendingDeletes);
    listensForPageHide = true;
  }

  setEntryHidden(entry.id, true);

  const toastId = toast(`Time entry #${entry.id} deleted`, {
    description: entry.comment,
    duration: UNDO_WINDOW_MS,
    action: { label: "Undo", onClick: () => undoDelete(entry.id) },
  });

  pending.set(entry.id, { timer: setTimeout(() => commitDelete(entry.id), UNDO_WINDOW_MS), toastId });
}
