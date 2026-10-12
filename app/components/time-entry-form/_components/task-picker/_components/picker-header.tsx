import { ChevronLeftIcon } from "lucide-react";
import { getParentView, getViewTrail } from "@/app/components/time-entry-form/lib/picker-view";
import type { PickerView } from "@/app/components/time-entry-form/types/picker-view";
import { Button } from "@/app/components/ui/button";

interface PickerHeaderProps {
  view: PickerView;
  onNavigate: (view: PickerView) => void;
}

export function PickerHeader({ view, onNavigate }: PickerHeaderProps) {
  if (view.level === "clients") {
    return null;
  }

  return (
    <div className="flex items-center gap-1 border-b px-1 py-1">
      <Button type="button" variant="ghost" size="icon-sm" aria-label="Back" onClick={() => onNavigate(getParentView(view))}>
        <ChevronLeftIcon />
      </Button>
      <span className="min-w-0 truncate text-xs text-muted-foreground">{getViewTrail(view)}</span>
    </div>
  );
}
