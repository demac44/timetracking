import { Skeleton } from "@/app/components/ui/skeleton";

export function EntriesSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading time entries">
      <div className="overflow-hidden rounded-lg border">
        <Skeleton className="h-10 rounded-none" />
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center gap-4 border-t px-3 py-3">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
}
