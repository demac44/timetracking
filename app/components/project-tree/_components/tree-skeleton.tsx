import { Skeleton } from "@/app/components/ui/skeleton";

export function TreeSkeleton() {
  return (
    <div className="flex flex-col" aria-busy="true" aria-label="Loading clients">
      <div className="border-b p-3">
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-3 p-3">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton className="size-4" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
