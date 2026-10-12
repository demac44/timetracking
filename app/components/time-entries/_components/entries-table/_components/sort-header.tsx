import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { TableHead } from "@/app/components/ui/table";
import { buildEntriesHref, type EntriesQuery } from "@/app/lib/search-params";
import { cn } from "@/app/lib/utils";
import type { TimeEntrySortField } from "@/app/types/time-entry";

interface SortHeaderProps {
  field: TimeEntrySortField;
  label: string;
  query: EntriesQuery;
  className?: string;
}

export function SortHeader({ field, label, query, className }: SortHeaderProps) {
  const isActive = query.sort === field;
  const nextOrder = isActive && query.order === "desc" ? "asc" : "desc";
  const Icon = !isActive ? ChevronsUpDownIcon : query.order === "asc" ? ArrowUpIcon : ArrowDownIcon;

  return (
    <TableHead
      className={className}
      aria-sort={isActive ? (query.order === "asc" ? "ascending" : "descending") : "none"}
    >
      <Link
        href={buildEntriesHref(query, { sort: field, order: nextOrder, page: 1 })}
        scroll={false}
        className={cn(
          "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
          isActive && "text-foreground",
        )}
      >
        {label}
        <Icon className={cn("size-3.5", !isActive && "opacity-50")} aria-hidden />
        <span className="sr-only">, sort {nextOrder === "asc" ? "ascending" : "descending"}</span>
      </Link>
    </TableHead>
  );
}
