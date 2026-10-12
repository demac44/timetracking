"use client";

import { Skeleton } from "@/app/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { useIsClient } from "@/app/hooks/use-is-client";
import { formatDayAndTime, formatFull, formatTime, getDayDifference } from "@/app/lib/time/display";

interface LocalDateTimeProps {
  value: string;
  relativeTo?: string;
}

export function LocalDateTime({ value, relativeTo }: LocalDateTimeProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-4 w-24" />;
  }

  const date = new Date(value);
  const reference = relativeTo ? new Date(relativeTo) : null;
  const dayOffset = reference ? getDayDifference(reference, date) : 0;
  const label = reference && dayOffset === 0 ? formatTime(date) : formatDayAndTime(date);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <time dateTime={value} className="whitespace-nowrap tabular-nums">
          {label}
          {reference && dayOffset === 1 && (
            <sup className="ml-0.5 text-[0.65rem] font-medium text-muted-foreground" aria-label="next day">
              +1
            </sup>
          )}
        </time>
      </TooltipTrigger>
      <TooltipContent>{formatFull(date)}</TooltipContent>
    </Tooltip>
  );
}
