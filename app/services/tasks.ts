import { apiClient } from "@/app/lib/api/client";
import type { Task } from "@/app/types/task";

export function getTask(id: number) {
  return apiClient.get<Task>(`/tasks/${id}`);
}
