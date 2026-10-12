"use client";

import { ChevronRightIcon } from "lucide-react";
import { StatusBadge } from "@/app/components/shared/status-badge";
import type { NamedItem } from "@/app/components/time-entry-form/types/task-path";
import { CommandEmpty, CommandGroup, CommandItem } from "@/app/components/ui/command";
import { useFetch } from "@/app/hooks/use-fetch";
import type { Project } from "@/app/types/project";
import { ListState } from "./list-state";

interface ProjectsViewProps {
  client: NamedItem;
  onProject: (project: Project) => void;
}

export function ProjectsView({ client, onProject }: ProjectsViewProps) {
  const projects = useFetch<Project[]>(`/api/v1/clients/${client.id}/projects`);

  return (
    <>
      <ListState state={projects.state} onRetry={projects.retry} />
      {projects.state?.status === "success" && (
        <>
          <CommandEmpty>
            {projects.state.data.length === 0 ? "This client has no projects." : "No projects found."}
          </CommandEmpty>
          <CommandGroup heading="Projects">
            {projects.state.data.map((project) => (
              <CommandItem key={project.id} value={`${project.name} #${project.id}`} onSelect={() => onProject(project)}>
                <span className="min-w-0 flex-1 truncate">{project.name}</span>
                <StatusBadge status={project.status} compact />
                <ChevronRightIcon className="text-muted-foreground" aria-hidden />
              </CommandItem>
            ))}
          </CommandGroup>
        </>
      )}
    </>
  );
}
