import { Skeleton } from "@/app/components/ui/skeleton";

export function EntryFormSkeleton() {
  return (
    <div className="space-y-5 px-4" aria-label="Loading time entry">
      {[0, 1, 2].map((row) => (
        <div key={row} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
