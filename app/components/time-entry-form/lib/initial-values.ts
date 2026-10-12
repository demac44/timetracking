import { getLatestRememberedEnd } from "@/app/components/time-entries/lib/entry-store";
import type { FormValues } from "@/app/components/time-entry-form/types/form";
import { getMinutesOfDay, roundDownToQuarter, toDateInputValue } from "@/app/lib/time/local";
import { formatTimeOfDay } from "@/app/lib/time/parse";
import type { TimeEntry } from "@/app/types/time-entry";
import { valuesFromEntry } from "./form-model";

function getDefaultStartMinutes(now: Date) {
  const latestEnd = getLatestRememberedEnd();
  const continuesLatest =
    latestEnd !== null && latestEnd <= now.getTime() && toDateInputValue(new Date(latestEnd)) === toDateInputValue(now);

  return continuesLatest ? getMinutesOfDay(new Date(latestEnd)) : roundDownToQuarter(getMinutesOfDay(now));
}

export function createInitialValues(entry: TimeEntry | null, initialTaskId: number | null): FormValues {
  if (entry) {
    return valuesFromEntry(entry);
  }

  const now = new Date();

  return {
    taskId: initialTaskId,
    comment: "",
    date: toDateInputValue(now),
    start: formatTimeOfDay(getDefaultStartMinutes(now)),
    end: "",
    duration: "",
  };
}
