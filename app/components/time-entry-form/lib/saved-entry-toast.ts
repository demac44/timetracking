import { toast } from "sonner";
import type { SaveTimeEntryResult } from "@/app/actions/time-entries";
import { openEntryDrawer } from "@/app/components/entry-drawer/lib/drawer-navigation";
import type { TaskPath } from "@/app/components/time-entry-form/types/task-path";
import { formatDay, formatTime } from "@/app/lib/time/display";
import { minutesBetween } from "@/app/lib/time/duration";
import { formatDuration } from "@/app/lib/time/parse";
import type { TimeEntry } from "@/app/types/time-entry";
import { formatTaskPath } from "./task-paths";

function describeSavedEntry(entry: TimeEntry, path: TaskPath | null) {
  const start = new Date(entry.start);
  const end = new Date(entry.end);
  const duration = formatDuration(minutesBetween(entry.start, entry.end));
  const task = path ? formatTaskPath(path) : `Task #${entry.taskId}`;

  return `${task} · ${formatDay(start)}, ${formatTime(start)} – ${formatTime(end)} (${duration})`;
}

export function showSavedEntryToast(result: Extract<SaveTimeEntryResult, { status: "success" }>, path: TaskPath | null) {
  const { entry, mode } = result;

  toast.success(`Time entry #${entry.id} ${mode}`, {
    description: describeSavedEntry(entry, path),
    action:
      mode === "created" ? { label: "Edit", onClick: () => openEntryDrawer({ mode: "edit", id: entry.id }) } : undefined,
  });
}
