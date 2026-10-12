"use client";

import { StatusBadge } from "@/app/components/shared/status-badge";
import type { NamedItem } from "@/app/components/time-entry-form/types/task-path";
import { CommandEmpty, CommandGroup, CommandItem } from "@/app/components/ui/command";
import { useFetch } from "@/app/hooks/use-fetch";
import { cn } from "@/app/lib/utils";
import type { Task } from "@/app/types/task";
import { ListState } from "./list-state";

interface TasksViewProps {
  project: NamedItem;
  selectedTaskId: number | null;
  onTask: (task: Task) => void;
}

export function TasksView({ project, selectedTaskId, onTask }: TasksViewProps) {
  const tasks = useFetch<Task[]>(`/api/v1/projects/${project.id}/tasks`);

  return (
    <>
      <ListState state={tasks.state} onRetry={tasks.retry} />
      {tasks.state?.status === "success" && (
        <>
          <CommandEmpty>{tasks.state.data.length === 0 ? "This project has no tasks." : "No tasks found."}</CommandEmpty>
          <CommandGroup heading="Tasks">
            {tasks.state.data.map((task) => (
              <CommandItem
                key={task.id}
                value={`${task.name} #${task.id}`}
                onSelect={() => onTask(task)}
                data-checked={task.id === selectedTaskId}
                className={cn(task.id === selectedTaskId && "font-medium")}
              >
                <span className="min-w-0 flex-1 truncate">{task.name}</span>
                <StatusBadge status={task.status} compact />
              </CommandItem>
            ))}
          </CommandGroup>
        </>
      )}
    </>
  );
}
