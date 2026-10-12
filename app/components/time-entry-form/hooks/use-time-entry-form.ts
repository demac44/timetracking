"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { saveTimeEntry } from "@/app/actions/time-entries";
import { highlightEntry, rememberEntries } from "@/app/components/time-entries/lib/entry-store";
import {
  getFirstInvalidField,
  normalizeTime,
  revalidateErrors,
  validateField,
  validateForm,
  withDurationApplied,
  withSyncedDuration,
} from "@/app/components/time-entry-form/lib/form-model";
import { createInitialValues } from "@/app/components/time-entry-form/lib/initial-values";
import { showSavedEntryToast } from "@/app/components/time-entry-form/lib/saved-entry-toast";
import type { FormErrors, FormField, FormValues } from "@/app/components/time-entry-form/types/form";
import type { SaveFailure } from "@/app/components/time-entry-form/types/save-failure";
import { useRetryCountdown } from "@/app/hooks/use-retry-countdown";
import type { TimeEntry } from "@/app/types/time-entry";
import { useTaskPath } from "./use-task-path";

interface UseTimeEntryFormOptions {
  entry: TimeEntry | null;
  initialTaskId: number | null;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: () => void;
}

export function useTimeEntryForm({ entry, initialTaskId, onDirtyChange, onSaved }: UseTimeEntryFormOptions) {
  const idPrefix = useId();
  const [initialValues] = useState(() => createInitialValues(entry, initialTaskId));
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [failure, setFailure] = useState<SaveFailure | null>(null);
  const [isPending, startTransition] = useTransition();
  const taskPath = useTaskPath(values.taskId);
  const { isWaiting } = useRetryCountdown(failure?.code === 429 ? failure.retryAt : undefined);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  useEffect(() => onDirtyChange(isDirty), [isDirty, onDirtyChange]);

  const fieldId = (field: FormField) => `${idPrefix}-${field}`;
  const errorId = (field: FormField) => `${idPrefix}-${field}-error`;

  const update = (patch: Partial<FormValues>) => {
    const next = { ...values, ...patch };
    setValues(next);
    setErrors(revalidateErrors(errors, next));
  };

  const commitBlur = (field: FormField) => {
    let next = values;

    if (field === "start" || field === "end") {
      next = withSyncedDuration({ ...values, [field]: normalizeTime(values[field]) });
    } else if (field === "duration") {
      next = withDurationApplied(values);
    }

    setValues(next);
    setErrors((current) => {
      const updated = revalidateErrors(current, next);
      const error = validateField(field, next);
      return error ? { ...updated, [field]: error } : updated;
    });
  };

  const save = (asNew: boolean) => {
    const { errors: nextErrors, payload } = validateForm(values);
    setErrors(nextErrors);

    if (!payload) {
      const firstInvalid = getFirstInvalidField(nextErrors);

      if (firstInvalid) {
        document.getElementById(fieldId(firstInvalid))?.focus();
      }
      return;
    }

    setFailure(null);

    startTransition(async () => {
      const result = await saveTimeEntry(asNew || !entry ? null : entry.id, payload);

      if (result.status === "error") {
        startTransition(() => {
          setFailure(result);
          setErrors(result.fieldErrors ?? {});
        });
        return;
      }

      rememberEntries([result.entry]);
      highlightEntry(result.entry.id);
      showSavedEntryToast(result, taskPath.path);
      onSaved();
    });
  };

  return {
    idPrefix,
    initialValues,
    values,
    errors,
    failure,
    taskPath,
    isPending,
    isSaveBlocked: isPending || isWaiting,
    fieldId,
    errorId,
    update,
    commitBlur,
    save,
  };
}
