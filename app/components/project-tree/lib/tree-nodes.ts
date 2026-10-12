import type {
  ChildrenState,
  ClientTreeNode,
  ProjectTreeNode,
  TaskTreeNode,
  TreeNode,
} from "@/app/components/project-tree/types/tree";
import type { Client } from "@/app/types/client";
import type { Project } from "@/app/types/project";
import type { Task } from "@/app/types/task";

export function treeItemId(key: string) {
  return `tree-item-${key}`;
}

export function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function filterClientsByName(clients: Client[], query: string) {
  const normalized = query.trim().toLowerCase();
  return normalized ? clients.filter((client) => client.name.toLowerCase().includes(normalized)) : clients;
}

export function createClientNode(client: Client): ClientTreeNode {
  return { key: `client-${client.id}`, kind: "client", level: 1, client };
}

export function createProjectNode(client: Client, project: Project): ProjectTreeNode {
  return { key: `project-${project.id}`, kind: "project", level: 2, client, project };
}

export function createTaskNode(client: Client, project: Project, task: Task): TaskTreeNode {
  return { key: `task-${task.id}`, kind: "task", level: 3, client, project, task };
}

export function buildVisibleNodes(
  clients: Client[],
  expanded: ReadonlySet<string>,
  projects: Record<number, ChildrenState<Project>>,
  tasks: Record<number, ChildrenState<Task>>,
) {
  const nodes: TreeNode[] = [];

  for (const client of clients) {
    const clientNode = createClientNode(client);
    const clientProjects = projects[client.id];
    nodes.push(clientNode);

    if (!expanded.has(clientNode.key) || clientProjects?.status !== "ready") {
      continue;
    }

    for (const project of clientProjects.items) {
      const projectNode = createProjectNode(client, project);
      const projectTasks = tasks[project.id];
      nodes.push(projectNode);

      if (!expanded.has(projectNode.key) || projectTasks?.status !== "ready") {
        continue;
      }

      nodes.push(...projectTasks.items.map((task) => createTaskNode(client, project, task)));
    }
  }

  return nodes;
}
