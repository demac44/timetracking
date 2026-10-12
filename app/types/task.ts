import type { EntityStatus } from "./api";

export interface Task {
  id: number;
  projectId: number;
  name: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}
