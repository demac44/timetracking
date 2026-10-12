"use server";

import { updateTag } from "next/cache";
import { describeApiError } from "@/app/lib/api/error-message";
import { ApiError } from "@/app/lib/api/errors";
import {
  getFieldErrors,
  timeEntrySchema,
  type TimeEntryFieldErrors,
  type TimeEntryFormValues,
} from "@/app/lib/validation/time-entry";
import { createTimeEntry, deleteTimeEntry, updateTimeEntry } from "@/app/services/time-entries";
import type { TimeEntry } from "@/app/types/time-entry";

export type SaveTimeEntryResult =
  | { status: "success"; mode: "created" | "updated"; entry: TimeEntry }
  | { status: "error"; code: number; message: string; fieldErrors?: TimeEntryFieldErrors; retryAt?: number };

export interface DeleteTimeEntriesResult {
  deleted: number[];
  failed: { id: number; code: number; message: string; retryAt?: number }[];
}

function isValidId(id: unknown): id is number {
  return Number.isInteger(id) && (id as number) >= 0;
}

function invalidateTimeEntries(id?: number) {
  updateTag("time-entries");

  if (id !== undefined) {
    updateTag(`time-entry:${id}`);
  }
}

function toFailure(error: unknown) {
  if (error instanceof ApiError) {
    return { code: error.status, message: describeApiError(error.status, error.message), retryAt: error.retryAt };
  }

  console.error(error);

  return { code: 500, message: describeApiError(500, "") };
}

export async function saveTimeEntry(id: number | null, values: TimeEntryFormValues): Promise<SaveTimeEntryResult> {
  if (id !== null && !isValidId(id)) {
    return { status: "error", code: 400, message: "This time entry has an invalid id." };
  }

  const parsed = timeEntrySchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      code: 422,
      message: "Some fields need your attention.",
      fieldErrors: getFieldErrors(parsed.error),
    };
  }

  try {
    const entry = id === null ? await createTimeEntry(parsed.data) : await updateTimeEntry(id, parsed.data);
    invalidateTimeEntries(entry.id);

    return { status: "success", mode: id === null ? "created" : "updated", entry };
  } catch (error) {
    return { status: "error", ...toFailure(error) };
  }
}

export async function deleteTimeEntries(ids: number[]): Promise<DeleteTimeEntriesResult> {
  const result: DeleteTimeEntriesResult = { deleted: [], failed: [] };

  for (const id of ids.filter(isValidId)) {
    try {
      await deleteTimeEntry(id);
      result.deleted.push(id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        result.deleted.push(id);
      } else {
        result.failed.push({ id, ...toFailure(error) });
      }
    }
  }

  if (result.deleted.length > 0) {
    invalidateTimeEntries();
    result.deleted.forEach((id) => updateTag(`time-entry:${id}`));
  }

  return result;
}

export async function refreshTimeEntries() {
  invalidateTimeEntries();
}
