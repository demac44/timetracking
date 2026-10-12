import { ListTodoIcon, PlusIcon } from "lucide-react";
import { logTime } from "@/app/components/project-tree/lib/log-time";
import { createTaskNode } from "@/app/components/project-tree/lib/tree-nodes";
import type { ProjectTree } from "@/app/components/project-tree/types/tree";
import { StatusBadge } from "@/app/components/shared/status-badge";
import { Button } from "@/app/components/ui/button";
import type { Client } from "@/app/types/client";
import type { Project } from "@/app/types/project";
import type { Task } from "@/app/types/task";
import { TreeItem } from "./tree-item";

interface TaskNodeProps {
  client: Client;
  project: Project;
  task: Task;
  tree: ProjectTree;
}

export function TaskNode({ client, project, task, tree }: TaskNodeProps) {
  return (
    <TreeItem
      node={createTaskNode(client, project, task)}
      tree={tree}
      icon={<ListTodoIcon />}
      label={task.name}
      trailing={
        <>
          <StatusBadge status={task.status} compact />
          <Button
            variant="ghost"
            size="xs"
            tabIndex={-1}
            className="text-muted-foreground hover:text-foreground"
            onClick={(event) => {
              event.stopPropagation();
              logTime(client, project, task);
            }}
          >
            <PlusIcon data-icon="inline-start" />
            Log time
          </Button>
        </>
      }
    />
  );
}
