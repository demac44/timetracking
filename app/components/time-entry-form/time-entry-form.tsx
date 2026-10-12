"use client";

import type { FormEvent } from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/components/ui/field";
import type { TimeEntry } from "@/app/types/time-entry";
import { CommentField } from "./_components/comment-field";
import { FormErrorBanner } from "./_components/form-error-banner";
import { FormFooter } from "./_components/form-footer";
import { TaskPicker } from "./_components/task-picker/task-picker";
import { TimeRangeFields } from "./_components/time-range-fields/time-range-fields";
import { useTimeEntryForm } from "./hooks/use-time-entry-form";

interface TimeEntryFormProps {
  entry: TimeEntry | null;
  initialTaskId: number | null;
  onDirtyChange: (dirty: boolean) => void;
  onCancel: () => void;
  onSaved: () => void;
  onDelete?: () => void;
}

export function TimeEntryForm({ entry, initialTaskId, onDirtyChange, onCancel, onSaved, onDelete }: TimeEntryFormProps) {
  const form = useTimeEntryForm({ entry, initialTaskId, onDirtyChange, onSaved });
  const { values, errors, isPending, fieldId, errorId } = form;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.save(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col" aria-busy={isPending}>
      <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        {form.failure && (
          <FormErrorBanner failure={form.failure} isEditing={entry !== null} onSaveAsNew={() => form.save(true)} />
        )}

        <FieldGroup>
          <Field data-invalid={Boolean(errors.taskId)}>
            <FieldLabel htmlFor={fieldId("taskId")}>Task</FieldLabel>
            <TaskPicker
              id={fieldId("taskId")}
              taskId={values.taskId}
              path={form.taskPath.path}
              pathStatus={form.taskPath.status}
              invalid={Boolean(errors.taskId)}
              describedBy={errors.taskId ? errorId("taskId") : undefined}
              disabled={isPending}
              autoFocus={form.initialValues.taskId === null}
              onChange={(taskId) => form.update({ taskId })}
            />
            <FieldError id={errorId("taskId")}>{errors.taskId}</FieldError>
          </Field>

          <CommentField
            id={fieldId("comment")}
            errorId={errorId("comment")}
            value={values.comment}
            error={errors.comment}
            disabled={isPending}
            autoFocus={form.initialValues.taskId !== null}
            onChange={(comment) => form.update({ comment })}
            onBlur={() => form.commitBlur("comment")}
          />

          <TimeRangeFields
            idPrefix={form.idPrefix}
            values={values}
            errors={errors}
            disabled={isPending}
            onChange={form.update}
            onBlur={form.commitBlur}
          />
        </FieldGroup>
      </div>

      <FormFooter
        isEditing={entry !== null}
        isPending={isPending}
        isSaveBlocked={form.isSaveBlocked}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </form>
  );
}
