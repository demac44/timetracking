"use client";

import Link from "next/link";
import { ClockIcon, PlusIcon } from "lucide-react";
import { openEntryDrawer } from "@/app/components/entry-drawer/lib/drawer-navigation";
import { Button } from "@/app/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/app/components/ui/empty";
import { buildEntriesHref, type EntriesQuery } from "@/app/lib/search-params";

export function EntriesEmpty({ query }: { query: EntriesQuery }) {
  const isFirstPage = query.page === 1;

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ClockIcon />
        </EmptyMedia>
        <EmptyTitle>{isFirstPage ? "No time entries yet" : "Nothing on this page"}</EmptyTitle>
        <EmptyDescription>
          {isFirstPage
            ? "Log the time you spend on tasks and it will show up here."
            : `There are no entries on page ${query.page}.`}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {isFirstPage ? (
          <Button onClick={() => openEntryDrawer({ mode: "new", taskId: null })}>
            <PlusIcon data-icon="inline-start" />
            Log your first entry
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href={buildEntriesHref(query, { page: 1 })}>Back to first page</Link>
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
