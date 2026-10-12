import { BuildingIcon } from "lucide-react";
import { createClientNode, pluralize } from "@/app/components/project-tree/lib/tree-nodes";
import type { ProjectTree } from "@/app/components/project-tree/types/tree";
import { StatusBadge } from "@/app/components/shared/status-badge";
import type { Client } from "@/app/types/client";
import { ChildrenStatus } from "./children-status";
import { ProjectNode } from "./project-node";
import { TreeItem } from "./tree-item";

interface ClientNodeProps {
  client: Client;
  tree: ProjectTree;
}

export function ClientNode({ client, tree }: ClientNodeProps) {
  const projects = tree.getProjects(client.id);

  return (
    <TreeItem
      node={createClientNode(client)}
      tree={tree}
      icon={<BuildingIcon />}
      label={client.name}
      description={client.description}
      meta={projects?.status === "ready" ? pluralize(projects.items.length, "project") : null}
      trailing={<StatusBadge status={client.status} compact />}
    >
      <ChildrenStatus
        state={projects}
        level={2}
        emptyLabel="No projects for this client"
        onRetry={() => tree.loadProjects(client.id)}
      />
      {projects?.status === "ready" &&
        projects.items.map((project) => <ProjectNode key={project.id} client={client} project={project} tree={tree} />)}
    </TreeItem>
  );
}
