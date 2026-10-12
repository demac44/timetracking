import type { SortOrder } from "@/app/types/api";
import { TIME_ENTRY_SORT_FIELDS, type TimeEntrySortField } from "@/app/types/time-entry";

export const PAGE_SIZES = [10, 25, 50] as const;

export type PageSize = (typeof PAGE_SIZES)[number];

export interface EntriesQuery {
  page: number;
  size: PageSize;
  sort: TimeEntrySortField;
  order: SortOrder;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

export const DEFAULT_ENTRIES_QUERY: EntriesQuery = { page: 1, size: 10, sort: "start", order: "desc" };

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pick<T extends string | number>(options: readonly T[], value: unknown, fallback: T): T {
  return options.find((option) => String(option) === value) ?? fallback;
}

export function parseEntriesQuery(params: RawSearchParams): EntriesQuery {
  const page = Number(first(params.page));

  return {
    page: Number.isInteger(page) && page > 0 ? page : DEFAULT_ENTRIES_QUERY.page,
    size: pick(PAGE_SIZES, first(params.size), DEFAULT_ENTRIES_QUERY.size),
    sort: pick(TIME_ENTRY_SORT_FIELDS, first(params.sort), DEFAULT_ENTRIES_QUERY.sort),
    order: pick(["asc", "desc"] as const, first(params.order), DEFAULT_ENTRIES_QUERY.order),
  };
}

export function buildEntriesHref(query: EntriesQuery, patch: Partial<EntriesQuery> = {}) {
  const next = { ...query, ...patch };
  const params = new URLSearchParams();

  for (const key of ["page", "size", "sort", "order"] as const) {
    if (next[key] !== DEFAULT_ENTRIES_QUERY[key]) {
      params.set(key, String(next[key]));
    }
  }

  const search = params.toString();
  return search ? `/?${search}` : "/";
}
