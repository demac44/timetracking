import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { buildEntriesHref, type EntriesQuery } from "@/app/lib/search-params";
import { PageLink } from "./_components/page-link";
import { PageSizeSelect } from "./_components/page-size-select";

interface EntriesPaginationProps {
  query: EntriesQuery;
  hasNextPage: boolean;
  shownCount: number;
}

export function EntriesPagination({ query, hasNextPage, shownCount }: EntriesPaginationProps) {
  const first = (query.page - 1) * query.size + 1;

  return (
    <nav aria-label="Time entries pages" className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <PageSizeSelect query={query} />

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground tabular-nums" aria-live="polite">
          {shownCount > 0 ? `Page ${query.page} · entries ${first}–${first + shownCount - 1}` : `Page ${query.page}`}
        </span>
        <div className="flex gap-1">
          <PageLink href={buildEntriesHref(query, { page: query.page - 1 })} disabled={query.page <= 1} label="Previous">
            <ChevronLeftIcon data-icon="inline-start" />
            Previous
          </PageLink>
          <PageLink href={buildEntriesHref(query, { page: query.page + 1 })} disabled={!hasNextPage} label="Next">
            Next
            <ChevronRightIcon data-icon="inline-end" />
          </PageLink>
        </div>
      </div>
    </nav>
  );
}
