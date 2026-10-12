import { cn } from "@/app/lib/utils";
import type { EntityStatus } from "@/app/types/api";

const STATUS_STYLES: Record<EntityStatus, { label: string; dot: string; text: string }> = {
  pending: { label: "Pending", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" },
  "in-progress": { label: "In progress", dot: "bg-sky-500", text: "text-sky-700 dark:text-sky-400" },
  completed: { label: "Completed", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400" },
};

interface StatusBadgeProps {
  status: EntityStatus;
  compact?: boolean;
  className?: string;
}

export function StatusBadge({ status, compact = false, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

  return (
    <span
      className={cn("inline-flex shrink-0 items-center gap-1.5 text-xs font-medium", style.text, className)}
      title={compact ? style.label : undefined}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
      <span className={cn(compact && "sr-only")}>{style.label}</span>
    </span>
  );
}
