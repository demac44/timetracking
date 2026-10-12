import { FolderIcon } from "lucide-react";
import { createProjectNode, pluralize } from "@/app/components/project-tree/lib/tree-nodes";
import type { ProjectTree } from "@/app/components/project-tree/types/tree";
import { StatusBadge } from "@/app/components/shared/status-badge";
import type { Client } from "@/app/types/client";
import type { Project } from "@/app/types/project";
import { ChildrenStatus } from "./children-status";
import { TaskNode } from "./task-node";
import { TreeItem } from "./tree-item";

interface ProjectNodeProps {
  client: Client;
  project: Project;
  tree: ProjectTree;
}

export function ProjectNode({ client, project, tree }: ProjectNodeProps) {
  const tasks = tree.getTasks(project.id);

  return (
    <TreeItem
      node={createProjectNode(client, project)}
      tree={tree}
      icon={<FolderIcon />}
      label={project.name}
      meta={tasks?.status === "ready" ? pluralize(tasks.items.length, "task") : null}
      trailing={<StatusBadge status={project.status} compact />}
    >
      <ChildrenStatus
        state={tasks}
        level={3}
        emptyLabel="No tasks in this project"
        onRetry={() => tree.loadTasks(project.id)}
      />
      {tasks?.status === "ready" &&
        tasks.items.map((task) => (
          <TaskNode key={task.id} client={client} project={project} task={task} tree={tree} />
        ))}
    </TreeItem>
  );
}
