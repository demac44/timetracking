"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { buildEntriesHref, PAGE_SIZES, type EntriesQuery, type PageSize } from "@/app/lib/search-params";

export function PageSizeSelect({ query }: { query: EntriesQuery }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span>Rows per page</span>
      <Select
        value={String(query.size)}
        onValueChange={(value) =>
          router.push(buildEntriesHref(query, { size: Number(value) as PageSize, page: 1 }), { scroll: false })
        }
      >
        <SelectTrigger size="sm" className="w-18" aria-label="Rows per page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZES.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
