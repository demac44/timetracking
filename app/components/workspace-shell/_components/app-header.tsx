import { TimerIcon } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2.5 border-b px-4 lg:px-6">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <TimerIcon className="size-4" aria-hidden />
      </span>
      <span className="font-heading text-base font-semibold tracking-tight">Memtime</span>
      <span className="hidden text-sm text-muted-foreground sm:inline">· Time tracking</span>
    </header>
  );
}
