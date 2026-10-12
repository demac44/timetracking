import type { FormErrors, FormField, FormValues } from "@/app/components/time-entry-form/types/form";
import { minutesBetween } from "@/app/lib/time/duration";
import { buildTimeRange, splitLocal } from "@/app/lib/time/local";
import { formatDuration, formatTimeOfDay, MINUTES_PER_DAY, parseDuration, parseTimeOfDay } from "@/app/lib/time/parse";
import { getFieldErrors, MAX_COMMENT_LENGTH, timeEntrySchema } from "@/app/lib/validation/time-entry";
import type { TimeEntry, TimeEntryInput } from "@/app/types/time-entry";

export const FIELD_ORDER: FormField[] = ["taskId", "comment", "date", "start", "end", "duration"];

const DATE_VALUE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_HINT = "Use a time like 9:30, 930 or 2pm";

export function getRange(values: FormValues) {
  const startMinutes = parseTimeOfDay(values.start);
  const endMinutes = parseTimeOfDay(values.end);

  if (!DATE_VALUE.test(values.date) || startMinutes === null || endMinutes === null) {
    return null;
  }

  return buildTimeRange(values.date, startMinutes, endMinutes);
}

export function valuesFromEntry(entry: TimeEntry): FormValues {
  const start = splitLocal(entry.start);
  const end = splitLocal(entry.end);

  return {
    taskId: entry.taskId,
    comment: entry.comment,
    date: start.date,
    start: formatTimeOfDay(start.minutes),
    end: formatTimeOfDay(end.minutes),
    duration: formatDuration(minutesBetween(entry.start, entry.end)),
  };
}

export function normalizeTime(value: string) {
  const minutes = parseTimeOfDay(value);
  return minutes === null ? value : formatTimeOfDay(minutes);
}

export function withSyncedDuration(values: FormValues): FormValues {
  const range = getRange(values);
  return range && range.durationMinutes > 0 ? { ...values, duration: formatDuration(range.durationMinutes) } : values;
}

export function withDurationApplied(values: FormValues): FormValues {
  const startMinutes = parseTimeOfDay(values.start);
  const durationMinutes = parseDuration(values.duration);

  if (startMinutes === null || durationMinutes === null || durationMinutes <= 0 || durationMinutes >= MINUTES_PER_DAY) {
    return values;
  }

  return {
    ...values,
    end: formatTimeOfDay(startMinutes + durationMinutes),
    duration: formatDuration(durationMinutes),
  };
}

function validateTime(value: string, label: string) {
  if (!value.trim()) {
    return `Enter ${label}`;
  }

  return parseTimeOfDay(value) === null ? TIME_HINT : undefined;
}

function validateDuration(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  const minutes = parseDuration(value);

  if (minutes === null) {
    return "Use a duration like 1h 30m, 1:30 or 90";
  }

  return minutes >= MINUTES_PER_DAY ? "A time entry can't be longer than 24 hours" : undefined;
}

export function validateField(field: FormField, values: FormValues): string | undefined {
  switch (field) {
    case "taskId":
      return values.taskId === null ? "Choose a task" : undefined;
    case "comment":
      if (!values.comment.trim()) {
        return "Describe what you worked on";
      }
      return values.comment.length > MAX_COMMENT_LENGTH
        ? `Keep the comment under ${MAX_COMMENT_LENGTH} characters`
        : undefined;
    case "date":
      return DATE_VALUE.test(values.date) ? undefined : "Pick a date";
    case "start":
      return validateTime(values.start, "a start time");
    case "end": {
      const error = validateTime(values.end, "an end time");
      return error ?? (getRange(values)?.durationMinutes === 0 ? "End time must be after the start time" : undefined);
    }
    case "duration":
      return validateDuration(values.duration);
  }
}

export function validateForm(values: FormValues): { errors: FormErrors; payload: TimeEntryInput | null } {
  const errors: FormErrors = {};

  for (const field of FIELD_ORDER) {
    const error = validateField(field, values);

    if (error) {
      errors[field] = error;
    }
  }

  const range = getRange(values);

  if (Object.keys(errors).length > 0 || !range) {
    return { errors, payload: null };
  }

  const parsed = timeEntrySchema.safeParse({
    taskId: values.taskId,
    comment: values.comment,
    start: range.start.toISOString(),
    end: range.end.toISOString(),
  });

  return parsed.success ? { errors: {}, payload: parsed.data } : { errors: getFieldErrors(parsed.error), payload: null };
}

export function getFirstInvalidField(errors: FormErrors) {
  return FIELD_ORDER.find((field) => errors[field]) ?? null;
}

export function revalidateErrors(errors: FormErrors, values: FormValues): FormErrors {
  const next: FormErrors = {};

  for (const field of FIELD_ORDER) {
    const error = errors[field] ? validateField(field, values) : undefined;

    if (error) {
      next[field] = error;
    }
  }

  return next;
}
