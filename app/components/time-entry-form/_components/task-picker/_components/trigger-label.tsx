import type { TaskPath, TaskPathStatus } from "@/app/components/time-entry-form/types/task-path";

interface TriggerLabelProps {
  taskId: number | null;
  path: TaskPath | null;
  pathStatus: TaskPathStatus;
}

export function TriggerLabel({ taskId, path, pathStatus }: TriggerLabelProps) {
  if (path) {
    return (
      <span className="min-w-0">
        <span className="block truncate font-medium">{path.task.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {path.client.name} › {path.project.name}
        </span>
      </span>
    );
  }

  if (taskId !== null) {
    return (
      <span className="min-w-0">
        <span className="block truncate font-medium">Task #{taskId}</span>
        <span className="block text-xs text-muted-foreground">
          {pathStatus === "loading" ? "Loading task details…" : "Task details unavailable"}
        </span>
      </span>
    );
  }

  return <span className="text-muted-foreground">Choose a client, project and task</span>;
}
