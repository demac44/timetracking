import type { EntityStatus } from "./api";

export interface Client {
  id: number;
  name: string;
  description: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}
