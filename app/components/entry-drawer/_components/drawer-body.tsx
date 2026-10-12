"use client";

import type { DrawerTarget } from "@/app/components/entry-drawer/types/drawer-target";
import { TimeEntryForm } from "@/app/components/time-entry-form/time-entry-form";
import { SheetDescription, SheetHeader, SheetTitle } from "@/app/components/ui/sheet";
import { EditEntryBody } from "./edit-entry-body";

interface DrawerBodyProps {
  target: DrawerTarget;
  onDirtyChange: (dirty: boolean) => void;
  onCancel: () => void;
  onDone: () => void;
}

export function DrawerBody({ target, onDirtyChange, onCancel, onDone }: DrawerBodyProps) {
  const isEditing = target.mode === "edit";

  return (
    <>
      <SheetHeader className="border-b">
        <SheetTitle>{isEditing ? `Edit time entry #${target.id}` : "New time entry"}</SheetTitle>
        <SheetDescription>
          {isEditing ? "Update the task, comment or times and save." : "Log time you spent on a task."}
        </SheetDescription>
      </SheetHeader>
      <div className="flex min-h-0 flex-1 flex-col pt-4">
        {target.mode === "new" ? (
          <TimeEntryForm
            entry={null}
            initialTaskId={target.taskId}
            onDirtyChange={onDirtyChange}
            onCancel={onCancel}
            onSaved={onDone}
          />
        ) : (
          <EditEntryBody id={target.id} onDirtyChange={onDirtyChange} onCancel={onCancel} onDone={onDone} />
        )}
      </div>
    </>
  );
}
