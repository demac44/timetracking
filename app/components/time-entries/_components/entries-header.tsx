"use client";

import { useTransition } from "react";
import { PlusIcon, RotateCwIcon } from "lucide-react";
import { refreshTimeEntries } from "@/app/actions/time-entries";
import { openEntryDrawer } from "@/app/components/entry-drawer/lib/drawer-navigation";
import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";

export function EntriesHeader() {
  const [isRefreshing, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-heading text-xl font-semibold tracking-tight">Time entries</h1>
        <p className="text-sm text-muted-foreground">Everything you have logged, newest first by default.</p>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Refresh time entries"
              disabled={isRefreshing}
              onClick={() => startTransition(() => refreshTimeEntries())}
            >
              <RotateCwIcon className={isRefreshing ? "animate-spin" : undefined} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
        <Button onClick={() => openEntryDrawer({ mode: "new", taskId: null })}>
          <PlusIcon data-icon="inline-start" />
          New entry
        </Button>
      </div>
    </div>
  );
}
