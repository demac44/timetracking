export interface TimeEntry {
  id: number;
  taskId: number;
  comment: string;
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTimeEntry extends TimeEntry {
  userId: string;
}

export type TimeEntryInput = Pick<TimeEntry, "taskId" | "comment" | "start" | "end">;

export interface DeleteTimeEntryResponse {
  message: string;
}

export const TIME_ENTRY_SORT_FIELDS = ["id", "start", "end", "createdAt"] as const;

export type TimeEntrySortField = (typeof TIME_ENTRY_SORT_FIELDS)[number];
