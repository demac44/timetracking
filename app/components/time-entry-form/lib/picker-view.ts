import type { PickerView } from "@/app/components/time-entry-form/types/picker-view";
import type { TaskPath } from "@/app/components/time-entry-form/types/task-path";

const SEARCH_PLACEHOLDERS: Record<PickerView["level"], string> = {
  clients: "Search clients…",
  projects: "Search projects…",
  tasks: "Search tasks…",
};

export function getInitialView(path: TaskPath | null): PickerView {
  return path ? { level: "tasks", client: path.client, project: path.project } : { level: "clients" };
}

export function getParentView(view: PickerView): PickerView {
  return view.level === "tasks" ? { level: "projects", client: view.client } : { level: "clients" };
}

export function getViewKey(view: PickerView) {
  if (view.level === "tasks") {
    return `tasks-${view.project.id}`;
  }

  return view.level === "projects" ? `projects-${view.client.id}` : "clients";
}

export function getViewTrail(view: PickerView) {
  if (view.level === "tasks") {
    return `${view.client.name} › ${view.project.name}`;
  }

  return view.level === "projects" ? view.client.name : "";
}

export function getSearchPlaceholder(view: PickerView) {
  return SEARCH_PLACEHOLDERS[view.level];
}
