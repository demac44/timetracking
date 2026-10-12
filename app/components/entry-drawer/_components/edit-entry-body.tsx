"use client";

import { useState } from "react";
import { PaneError } from "@/app/components/shared/pane-error";
import { getRememberedEntry } from "@/app/components/time-entries/lib/entry-store";
import { deleteWithUndo } from "@/app/components/time-entries/lib/pending-deletes";
import { TimeEntryForm } from "@/app/components/time-entry-form/time-entry-form";
import { useFetch } from "@/app/hooks/use-fetch";
import type { TimeEntry } from "@/app/types/time-entry";
import { EntryFormSkeleton } from "./entry-form-skeleton";
import { EntryNotFound } from "./entry-not-found";

interface EditEntryBodyProps {
  id: number;
  onDirtyChange: (dirty: boolean) => void;
  onCancel: () => void;
  onDone: () => void;
}

export function EditEntryBody({ id, onDirtyChange, onCancel, onDone }: EditEntryBodyProps) {
  const [remembered] = useState(() => getRememberedEntry(id));
  const { state, retry } = useFetch<TimeEntry>(remembered ? null : `/api/v1/time-entries/${id}`, { cache: false });
  const entry = remembered ?? (state?.status === "success" ? state.data : null);

  if (entry) {
    return (
      <TimeEntryForm
        entry={entry}
        initialTaskId={entry.taskId}
        onDirtyChange={onDirtyChange}
        onCancel={onCancel}
        onSaved={onDone}
        onDelete={() => {
          onDone();
          deleteWithUndo(entry);
        }}
      />
    );
  }

  if (state?.status === "error" && state.error.status === 404) {
    return <EntryNotFound id={id} onClose={onDone} />;
  }

  if (state?.status === "error") {
    return (
      <div className="px-4">
        <PaneError
          title="Couldn't load this time entry"
          status={state.error.status}
          message={state.error.message}
          retryAt={state.error.retryAt}
          onRetry={retry}
        />
      </div>
    );
  }

  return <EntryFormSkeleton />;
}
