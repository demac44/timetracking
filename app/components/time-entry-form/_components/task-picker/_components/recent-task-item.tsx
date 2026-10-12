"use client";

import { HistoryIcon } from "lucide-react";
import { CommandItem } from "@/app/components/ui/command";
import { useFetch } from "@/app/hooks/use-fetch";
import type { Task } from "@/app/types/task";

interface RecentTaskItemProps {
  taskId: number;
  onSelect: () => void;
}

export function RecentTaskItem({ taskId, onSelect }: RecentTaskItemProps) {
  const task = useFetch<Task>(`/api/v1/tasks/${taskId}`);
  const name = task.state?.status === "success" ? task.state.data.name : `Task #${taskId}`;

  return (
    <CommandItem value={`recent ${name} #${taskId}`} onSelect={onSelect}>
      <HistoryIcon className="text-muted-foreground" aria-hidden />
      <span className="min-w-0 flex-1 truncate">{name}</span>
      <span className="text-xs text-muted-foreground tabular-nums">#{taskId}</span>
    </CommandItem>
  );
}
