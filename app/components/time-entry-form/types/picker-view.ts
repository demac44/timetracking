import type { NamedItem } from "./task-path";

export type PickerView =
  | { level: "clients" }
  | { level: "projects"; client: NamedItem }
  | { level: "tasks"; client: NamedItem; project: NamedItem };
