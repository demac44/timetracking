import { apiClient } from "@/app/lib/api/client";
import type { PaginationParams } from "@/app/types/api";
import type { ApiTimeEntry, DeleteTimeEntryResponse, TimeEntry, TimeEntryInput } from "@/app/types/time-entry";

function toTimeEntry({ id, taskId, comment, start, end, createdAt, updatedAt }: ApiTimeEntry): TimeEntry {
  return { id, taskId, comment, start, end, createdAt, updatedAt };
}

export async function getTimeEntries(params?: PaginationParams<TimeEntry>) {
  const timeEntries = await apiClient.get<ApiTimeEntry[]>("/time-entries", params);
  return timeEntries.map(toTimeEntry);
}

export async function getTimeEntry(id: number) {
  return toTimeEntry(await apiClient.get<ApiTimeEntry>(`/time-entries/${id}`));
}

export async function createTimeEntry(input: TimeEntryInput) {
  return toTimeEntry(await apiClient.post<ApiTimeEntry>("/time-entries", input));
}

export async function updateTimeEntry(id: number, input: TimeEntryInput) {
  return toTimeEntry(await apiClient.put<ApiTimeEntry>(`/time-entries/${id}`, input));
}

export function deleteTimeEntry(id: number) {
  return apiClient.delete<DeleteTimeEntryResponse>(`/time-entries/${id}`);
}
