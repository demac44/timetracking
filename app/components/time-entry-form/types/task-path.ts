export interface NamedItem {
  id: number;
  name: string;
}

export interface TaskPath {
  client: NamedItem;
  project: NamedItem;
  task: NamedItem;
}

export type TaskPathStatus = "idle" | "loading" | "ready" | "failed";
