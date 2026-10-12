"use client";

import { formatDay, formatTime, getTimeZoneName } from "@/app/lib/time/display";
import { formatDuration } from "@/app/lib/time/parse";
import type { TimeRange } from "@/app/types/time-range";

interface RangeSummaryProps {
  range: TimeRange | null;
}

export function RangeSummary({ range }: RangeSummaryProps) {
  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm" aria-live="polite">
      {range && range.durationMinutes > 0 ? (
        <p className="font-medium">
          {formatDay(range.start)} · {formatTime(range.start)} – {formatTime(range.end)}
          {range.endsNextDay && " (next day)"} · {formatDuration(range.durationMinutes)}
        </p>
      ) : (
        <p className="text-muted-foreground">
          Type times like 930, 9:30 or 2pm. An end time before the start counts as the next day.
        </p>
      )}
      <p className="text-xs text-muted-foreground">Times are in your time zone ({getTimeZoneName()}).</p>
    </div>
  );
}
