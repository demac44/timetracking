"use client";

import { ChevronRightIcon } from "lucide-react";
import { CommandEmpty, CommandGroup, CommandItem } from "@/app/components/ui/command";
import { useFetch } from "@/app/hooks/use-fetch";
import type { Client } from "@/app/types/client";
import type { TimeEntry } from "@/app/types/time-entry";
import { ListState } from "./list-state";
import { RecentTaskItem } from "./recent-task-item";

const RECENT_LIMIT = 5;
const RECENT_ENTRIES_URL = "/api/v1/time-entries?limit=20&sortBy=start&order=desc";

interface ClientsViewProps {
  onRecent: (taskId: number) => void;
  onClient: (client: Client) => void;
}

export function ClientsView({ onRecent, onClient }: ClientsViewProps) {
  const clients = useFetch<Client[]>("/api/v1/clients");
  const recentEntries = useFetch<TimeEntry[]>(RECENT_ENTRIES_URL, { cache: false });
  const recentTaskIds =
    recentEntries.state?.status === "success"
      ? [...new Set(recentEntries.state.data.map((entry) => entry.taskId))].slice(0, RECENT_LIMIT)
      : [];

  return (
    <>
      {recentTaskIds.length > 0 && (
        <CommandGroup heading="Recent">
          {recentTaskIds.map((recentTaskId) => (
            <RecentTaskItem key={recentTaskId} taskId={recentTaskId} onSelect={() => onRecent(recentTaskId)} />
          ))}
        </CommandGroup>
      )}
      <ListState state={clients.state} onRetry={clients.retry} />
      {clients.state?.status === "success" && (
        <>
          <CommandEmpty>No clients found.</CommandEmpty>
          <CommandGroup heading="Clients">
            {clients.state.data.map((client) => (
              <CommandItem key={client.id} value={`${client.name} #${client.id}`} onSelect={() => onClient(client)}>
                <span className="min-w-0 flex-1 truncate">{client.name}</span>
                <ChevronRightIcon className="text-muted-foreground" aria-hidden />
              </CommandItem>
            ))}
          </CommandGroup>
        </>
      )}
    </>
  );
}
