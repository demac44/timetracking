"use client";

import type { ReactNode } from "react";
import { useVisibleEntries } from "@/app/components/time-entries/hooks/use-visible-entries";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import type { EntriesQuery } from "@/app/lib/search-params";
import type { TimeEntry } from "@/app/types/time-entry";
import { EntriesEmpty } from "./_components/entries-empty";
import { EntryRow } from "./_components/entry-row";
import { SortHeader } from "./_components/sort-header";

interface EntriesTableProps {
  entries: TimeEntry[];
  query: EntriesQuery;
  taskNames: Record<number, ReactNode>;
}

export function EntriesTable({ entries, query, taskNames }: EntriesTableProps) {
  const { visibleEntries, highlightedId } = useVisibleEntries(entries);

  if (visibleEntries.length === 0) {
    return <EntriesEmpty query={query} />;
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <SortHeader field="id" label="ID" query={query} className="w-16" />
            <TableHead>Task</TableHead>
            <TableHead className="min-w-48">Comment</TableHead>
            <SortHeader field="start" label="Start" query={query} />
            <SortHeader field="end" label="End" query={query} />
            <TableHead className="text-right">Duration</TableHead>
            <SortHeader field="createdAt" label="Created" query={query} className="hidden xl:table-cell" />
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleEntries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              taskName={taskNames[entry.id]}
              highlighted={highlightedId === entry.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
