import { getTaskById } from "@/app/services/cached";

export async function TaskName({ taskId }: { taskId: number }) {
  const result = await getTaskById(taskId);

  return (
    <span className="flex min-w-0 flex-col">
      <span className="truncate font-medium">{result.ok ? result.data.name : `Task #${taskId}`}</span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {result.ok ? `#${taskId}` : result.status === 404 ? "Task no longer exists" : "Name unavailable"}
      </span>
    </span>
  );
}
