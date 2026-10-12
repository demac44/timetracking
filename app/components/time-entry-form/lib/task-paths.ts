import type { NamedItem, TaskPath } from "@/app/components/time-entry-form/types/task-path";
import { fetchJson } from "@/app/lib/api/browser";
import type { Client } from "@/app/types/client";
import type { Project } from "@/app/types/project";
import type { Task } from "@/app/types/task";

const paths = new Map<number, TaskPath>();
const inFlight = new Map<number, Promise<TaskPath>>();

function pickNamed({ id, name }: NamedItem): NamedItem {
  return { id, name };
}

export function rememberTaskPath(client: NamedItem, project: NamedItem, task: NamedItem) {
  const path = { client: pickNamed(client), project: pickNamed(project), task: pickNamed(task) };
  paths.set(task.id, path);
  return path;
}

export function getCachedTaskPath(taskId: number) {
  return paths.get(taskId) ?? null;
}

async function loadTaskPath(taskId: number) {
  const task = await fetchJson<Task>(`/api/v1/tasks/${taskId}`);
  const project = await fetchJson<Project>(`/api/v1/projects/${task.projectId}`);
  const client = await fetchJson<Client>(`/api/v1/clients/${project.clientId}`);

  return rememberTaskPath(client, project, task);
}

export function resolveTaskPath(taskId: number) {
  const cached = paths.get(taskId);

  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = inFlight.get(taskId) ?? loadTaskPath(taskId).finally(() => inFlight.delete(taskId));
  inFlight.set(taskId, pending);

  return pending;
}

export function formatTaskPath(path: TaskPath) {
  return `${path.client.name} › ${path.project.name} › ${path.task.name}`;
}
