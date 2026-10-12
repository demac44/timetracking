import "server-only";

import { cacheTag } from "next/cache";
import { apiClient } from "@/app/lib/api/client";
import { applyCacheLife, toResult, withRateLimit } from "@/app/lib/api/result";
import type { SortOrder } from "@/app/types/api";
import type { Client } from "@/app/types/client";
import type { Project } from "@/app/types/project";
import type { Task } from "@/app/types/task";
import type { TimeEntry, TimeEntrySortField } from "@/app/types/time-entry";
import { getClient, getClientProjects, getClients } from "./clients";
import { getProject, getProjectTasks } from "./projects";
import { getTimeEntries, getTimeEntry } from "./time-entries";

const PAGE_LIMIT = 100;
const LABEL_REQUEST_RESERVE = 3;

const nameCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

async function loadAllPages<T extends { name: string }>(loadPage: (offset: number) => Promise<T[]>) {
  const items: T[] = [];

  for (let offset = 0; ; offset += PAGE_LIMIT) {
    const page = await loadPage(offset);
    items.push(...page);

    if (page.length < PAGE_LIMIT) {
      return items.sort((a, b) => nameCollator.compare(a.name, b.name));
    }
  }
}

async function readAllClients() {
  "use cache";
  cacheTag("clients");

  const result = await toResult(() =>
    loadAllPages<Client>((offset) => getClients({ limit: PAGE_LIMIT, offset })),
  );
  applyCacheLife(result, "hours");

  return result;
}

async function readAllClientProjects(clientId: number) {
  "use cache";
  cacheTag(`client:${clientId}:projects`);

  const result = await toResult(() =>
    loadAllPages<Project>((offset) =>
      getClientProjects(clientId, { limit: PAGE_LIMIT, offset }),
    ),
  );
  applyCacheLife(result, "hours");

  return result;
}

async function readAllProjectTasks(projectId: number) {
  "use cache";
  cacheTag(`project:${projectId}:tasks`);

  const result = await toResult(() =>
    loadAllPages<Task>((offset) =>
      getProjectTasks(projectId, { limit: PAGE_LIMIT, offset }),
    ),
  );
  applyCacheLife(result, "hours");

  return result;
}

async function readClientById(id: number) {
  "use cache";
  cacheTag(`client:${id}`);

  const result = await toResult(() => getClient(id));
  applyCacheLife(result, "hours");

  return result;
}

async function readProjectById(id: number) {
  "use cache";
  cacheTag(`project:${id}`);

  const result = await toResult(() => getProject(id));
  applyCacheLife(result, "hours");

  return result;
}

async function readTaskById(id: number) {
  "use cache";
  cacheTag(`task:${id}`);

  const result = await toResult(() => apiClient.get<Task>(`/tasks/${id}`, undefined, LABEL_REQUEST_RESERVE));
  applyCacheLife(result, "hours");

  return result;
}

async function readTimeEntriesList(limit: number, offset: number, sortBy: TimeEntrySortField, order: SortOrder) {
  "use cache";
  cacheTag("time-entries");

  const result = await toResult(() => getTimeEntries({ limit, offset, sortBy, order }));
  applyCacheLife(result, "minutes");

  return result;
}

async function readTimeEntryById(id: number) {
  "use cache";
  cacheTag("time-entries", `time-entry:${id}`);

  const result = await toResult(() => getTimeEntry(id));
  applyCacheLife(result, "minutes");

  return result;
}

export const getAllClients = withRateLimit(readAllClients);
export const getAllClientProjects = withRateLimit(readAllClientProjects);
export const getAllProjectTasks = withRateLimit(readAllProjectTasks);
export const getClientById = withRateLimit(readClientById);
export const getProjectById = withRateLimit(readProjectById);
export const getTaskById = withRateLimit(readTaskById);
export const getTimeEntriesList = withRateLimit(readTimeEntriesList);
export const getTimeEntryById = withRateLimit(readTimeEntryById);

function compareEntries(sortBy: TimeEntrySortField, order: SortOrder) {
  const direction = order === "asc" ? 1 : -1;
  const value = (entry: TimeEntry) => (sortBy === "id" ? entry.id : Date.parse(entry[sortBy]));

  return (a: TimeEntry, b: TimeEntry) => (value(a) - value(b)) * direction;
}

export async function getTimeEntriesPage(page: number, size: number, sortBy: TimeEntrySortField, order: SortOrder) {
  const result = await getTimeEntriesList(size + 1, (page - 1) * size, sortBy, order);

  if (!result.ok) {
    return result;
  }

  const entries = result.data.toSorted(compareEntries(sortBy, order));

  return {
    ok: true as const,
    data: { entries: entries.slice(0, size), hasNextPage: entries.length > size },
  };
}
