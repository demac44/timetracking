import { apiClient } from "@/app/lib/api/client";
import type { PaginationParams } from "@/app/types/api";
import type { Project } from "@/app/types/project";
import type { Task } from "@/app/types/task";

export function getProject(id: number) {
  return apiClient.get<Project>(`/projects/${id}`);
}

export function getProjectTasks(id: number, params?: PaginationParams<Task>) {
  return apiClient.get<Task[]>(`/projects/${id}/tasks`, params);
}
