import { Suspense } from "react";
import { PaneError } from "@/app/components/shared/pane-error";
import { Skeleton } from "@/app/components/ui/skeleton";
import { parseEntriesQuery } from "@/app/lib/search-params";
import { getTimeEntriesPage } from "@/app/services/cached";
import { EntriesPagination } from "./_components/entries-pagination/entries-pagination";
import { EntriesTable } from "./_components/entries-table/entries-table";
import { TaskName } from "./_components/task-name";

interface EntriesSectionProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function EntriesSection({ searchParams }: EntriesSectionProps) {
  const query = parseEntriesQuery(await searchParams);
  const result = await getTimeEntriesPage(query.page, query.size, query.sort, query.order);

  if (!result.ok) {
    return (
      <PaneError
        title="Couldn't load time entries"
        status={result.status}
        message={result.message}
        retryAt={result.retryAt}
      />
    );
  }

  const { entries, hasNextPage } = result.data;
  const taskNames = Object.fromEntries(
    entries.map((entry) => [
      entry.id,
      <Suspense key={entry.id} fallback={<Skeleton className="h-8 w-32" />}>
        <TaskName taskId={entry.taskId} />
      </Suspense>,
    ]),
  );

  return (
    <div className="flex flex-col gap-3">
      <EntriesTable entries={entries} query={query} taskNames={taskNames} />
      <EntriesPagination query={query} hasNextPage={hasNextPage} shownCount={entries.length} />
    </div>
  );
}
