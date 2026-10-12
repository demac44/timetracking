import type { ApiError } from "@/app/lib/api/errors";
import type { Client } from "@/app/types/client";
import type { Project } from "@/app/types/project";
import type { Task } from "@/app/types/task";

export type ClientTreeNode = { key: string; kind: "client"; level: 1; client: Client };

export type ProjectTreeNode = { key: string; kind: "project"; level: 2; client: Client; project: Project };

export type TaskTreeNode = { key: string; kind: "task"; level: 3; client: Client; project: Project; task: Task };

export type TreeNode = ClientTreeNode | ProjectTreeNode | TaskTreeNode;

export type ChildrenState<T> =
  | { status: "loading" }
  | { status: "ready"; items: T[] }
  | { status: "error"; error: ApiError };

export interface ProjectTree {
  nodes: TreeNode[];
  tabbableKey: string | null;
  isExpanded: (key: string) => boolean;
  getProjects: (clientId: number) => ChildrenState<Project> | undefined;
  getTasks: (projectId: number) => ChildrenState<Task> | undefined;
  loadProjects: (clientId: number) => void;
  loadTasks: (projectId: number) => void;
  setFocusedKey: (key: string) => void;
  toggle: (node: TreeNode) => void;
  activate: (node: TreeNode) => void;
}
