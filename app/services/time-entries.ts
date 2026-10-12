import { apiClient } from "@/app/lib/api/client";
import type { PaginationParams } from "@/app/types/api";
import type { DeleteTimeEntryResponse, TimeEntry, TimeEntryInput } from "@/app/types/time-entry";

export function getTimeEntries(params?: PaginationParams<TimeEntry>) {
  return apiClient.get<TimeEntry[]>("/time-entries", params);
}

export function getTimeEntry(id: number) {
  return apiClient.get<TimeEntry>(`/time-entries/${id}`);
}

export function createTimeEntry(input: TimeEntryInput) {
  return apiClient.post<TimeEntry>("/time-entries", input);
}

export function updateTimeEntry(id: number, input: TimeEntryInput) {
  return apiClient.put<TimeEntry>(`/time-entries/${id}`, input);
}

export function deleteTimeEntry(id: number) {
  return apiClient.delete<DeleteTimeEntryResponse>(`/time-entries/${id}`);
}
