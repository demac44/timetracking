import type { EntityStatus } from "./api";

export interface Project {
  id: number;
  clientId: number;
  name: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}
