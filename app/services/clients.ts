import { apiClient } from "@/app/lib/api/client";
import type { PaginationParams } from "@/app/types/api";
import type { Client } from "@/app/types/client";
import type { Project } from "@/app/types/project";

export function getClients(params?: PaginationParams<Client>) {
  return apiClient.get<Client[]>("/clients", params);
}

export function getClient(id: number) {
  return apiClient.get<Client>(`/clients/${id}`);
}

export function getClientProjects(id: number, params?: PaginationParams<Project>) {
  return apiClient.get<Project[]>(`/clients/${id}/projects`, params);
}
