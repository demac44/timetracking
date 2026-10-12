"use client";

import type { ReactNode } from "react";
import { openEntryDrawer } from "@/app/components/entry-drawer/lib/drawer-navigation";
import { LocalDateTime } from "@/app/components/shared/local-date-time";
import { TableCell, TableRow } from "@/app/components/ui/table";
import { minutesBetween } from "@/app/lib/time/duration";
import { formatDuration } from "@/app/lib/time/parse";
import { cn } from "@/app/lib/utils";
import type { TimeEntry } from "@/app/types/time-entry";
import { RowActions } from "./row-actions";

interface EntryRowProps {
  entry: TimeEntry;
  taskName: ReactNode;
  highlighted: boolean;
}

export function EntryRow({ entry, taskName, highlighted }: EntryRowProps) {
  const open = () => openEntryDrawer({ mode: "edit", id: entry.id });

  return (
    <TableRow
      id={`entry-row-${entry.id}`}
      tabIndex={0}
      aria-label={`Time entry #${entry.id}, press Enter to edit`}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target === event.currentTarget) {
          open();
        }
      }}
      className={cn(
        "cursor-pointer transition-colors duration-700 focus-visible:bg-muted focus-visible:outline-none",
        highlighted && "bg-amber-100/70 duration-0 dark:bg-amber-500/15",
      )}
    >
      <TableCell className="text-muted-foreground tabular-nums">{entry.id}</TableCell>
      <TableCell className="max-w-48">{taskName}</TableCell>
      <TableCell className="max-w-80 whitespace-normal">
        <p className="line-clamp-2 break-words" title={entry.comment}>
          {entry.comment}
        </p>
      </TableCell>
      <TableCell>
        <LocalDateTime value={entry.start} />
      </TableCell>
      <TableCell>
        <LocalDateTime value={entry.end} relativeTo={entry.start} />
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatDuration(minutesBetween(entry.start, entry.end))}
      </TableCell>
      <TableCell className="hidden text-muted-foreground xl:table-cell">
        <LocalDateTime value={entry.createdAt} />
      </TableCell>
      <TableCell>
        <RowActions entry={entry} />
      </TableCell>
    </TableRow>
  );
}
