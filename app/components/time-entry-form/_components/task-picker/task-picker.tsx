"use client";

import { useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { getInitialView, getSearchPlaceholder, getViewKey } from "@/app/components/time-entry-form/lib/picker-view";
import { rememberTaskPath } from "@/app/components/time-entry-form/lib/task-paths";
import type { PickerView } from "@/app/components/time-entry-form/types/picker-view";
import type { TaskPath, TaskPathStatus } from "@/app/components/time-entry-form/types/task-path";
import { Button } from "@/app/components/ui/button";
import { Command, CommandInput, CommandList } from "@/app/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { ClientsView } from "./_components/clients-view";
import { PickerHeader } from "./_components/picker-header";
import { ProjectsView } from "./_components/projects-view";
import { TasksView } from "./_components/tasks-view";
import { TriggerLabel } from "./_components/trigger-label";

interface TaskPickerProps {
  id: string;
  taskId: number | null;
  path: TaskPath | null;
  pathStatus: TaskPathStatus;
  invalid: boolean;
  describedBy?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onChange: (taskId: number, path: TaskPath | null) => void;
}

export function TaskPicker({
  id,
  taskId,
  path,
  pathStatus,
  invalid,
  describedBy,
  disabled,
  autoFocus,
  onChange,
}: TaskPickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PickerView>({ level: "clients" });
  const [search, setSearch] = useState("");

  const navigate = (next: PickerView) => {
    setView(next);
    setSearch("");
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      navigate(getInitialView(path));
    }

    setOpen(next);
  };

  const choose = (nextTaskId: number, nextPath: TaskPath | null) => {
    onChange(nextTaskId, nextPath);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          data-autofocus={autoFocus || undefined}
          className="h-auto min-h-11 w-full justify-between py-1.5 text-left font-normal"
        >
          <TriggerLabel taskId={taskId} path={path} pathStatus={pathStatus} />
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-72 p-0">
        <Command key={getViewKey(view)}>
          <PickerHeader view={view} onNavigate={navigate} />
          <CommandInput autoFocus value={search} onValueChange={setSearch} placeholder={getSearchPlaceholder(view)} />
          <CommandList className="max-h-72">
            {view.level === "clients" && (
              <ClientsView
                onRecent={(recentTaskId) => choose(recentTaskId, null)}
                onClient={(client) => navigate({ level: "projects", client })}
              />
            )}
            {view.level === "projects" && (
              <ProjectsView client={view.client} onProject={(project) => navigate({ ...view, level: "tasks", project })} />
            )}
            {view.level === "tasks" && (
              <TasksView
                project={view.project}
                selectedTaskId={taskId}
                onTask={(task) => choose(task.id, rememberTaskPath(view.client, view.project, task))}
              />
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
