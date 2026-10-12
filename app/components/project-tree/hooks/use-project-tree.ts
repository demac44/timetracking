"use client";

import { useMemo, useState } from "react";
import { logTime } from "@/app/components/project-tree/lib/log-time";
import { buildVisibleNodes } from "@/app/components/project-tree/lib/tree-nodes";
import type { ProjectTree, TreeNode } from "@/app/components/project-tree/types/tree";
import type { Client } from "@/app/types/client";
import type { Project } from "@/app/types/project";
import type { Task } from "@/app/types/task";
import { useLazyChildren } from "./use-lazy-children";

const projectsUrl = (clientId: number) => `/api/v1/clients/${clientId}/projects`;
const tasksUrl = (projectId: number) => `/api/v1/projects/${projectId}/tasks`;

export function useProjectTree(clients: Client[]): ProjectTree {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const projects = useLazyChildren<Project>(projectsUrl);
  const tasks = useLazyChildren<Task>(tasksUrl);

  const nodes = useMemo(
    () => buildVisibleNodes(clients, expanded, projects.children, tasks.children),
    [clients, expanded, projects.children, tasks.children],
  );

  const loadChildren = (node: TreeNode) => {
    if (node.kind === "client" && projects.children[node.client.id]?.status !== "ready") {
      void projects.load(node.client.id);
    }

    if (node.kind === "project" && tasks.children[node.project.id]?.status !== "ready") {
      void tasks.load(node.project.id);
    }
  };

  const toggle = (node: TreeNode) => {
    if (node.kind === "task") {
      return;
    }

    const isOpen = expanded.has(node.key);

    setExpanded((current) => {
      const next = new Set(current);

      if (isOpen) {
        next.delete(node.key);
      } else {
        next.add(node.key);
      }

      return next;
    });

    if (!isOpen) {
      loadChildren(node);
    }
  };

  const activate = (node: TreeNode) => {
    if (node.kind === "task") {
      logTime(node.client, node.project, node.task);
    } else {
      toggle(node);
    }
  };

  return {
    nodes,
    tabbableKey: nodes.some((node) => node.key === focusedKey) ? focusedKey : (nodes[0]?.key ?? null),
    isExpanded: (key) => expanded.has(key),
    getProjects: (clientId) => projects.children[clientId],
    getTasks: (projectId) => tasks.children[projectId],
    loadProjects: (clientId) => void projects.load(clientId),
    loadTasks: (projectId) => void tasks.load(projectId),
    setFocusedKey,
    toggle,
    activate,
  };
}
