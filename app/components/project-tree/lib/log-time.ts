import { openEntryDrawer } from "@/app/components/entry-drawer/lib/drawer-navigation";
import { rememberTaskPath } from "@/app/components/time-entry-form/lib/task-paths";
import type { Client } from "@/app/types/client";
import type { Project } from "@/app/types/project";
import type { Task } from "@/app/types/task";

export function logTime(client: Client, project: Project, task: Task) {
  rememberTaskPath(client, project, task);
  openEntryDrawer({ mode: "new", taskId: task.id });
}
