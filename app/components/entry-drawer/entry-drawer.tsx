"use client";

import { useCallback, useState } from "react";
import { Sheet, SheetContent } from "@/app/components/ui/sheet";
import { useIsClient } from "@/app/hooks/use-is-client";
import { DiscardChangesDialog } from "./_components/discard-changes-dialog";
import { DrawerBody } from "./_components/drawer-body";
import { useEntryDrawerTarget } from "./hooks/use-entry-drawer-target";
import { focusPreferredField } from "./lib/drawer-focus";
import { closeEntryDrawer, getTargetKey } from "./lib/drawer-navigation";

export function EntryDrawer() {
  const isClient = useIsClient();
  const target = useEntryDrawerTarget();
  const [shownTarget, setShownTarget] = useState(target);
  const [isDirty, setIsDirty] = useState(false);
  const [isConfirmingDiscard, setIsConfirmingDiscard] = useState(false);

  if (target && getTargetKey(target) !== getTargetKey(shownTarget)) {
    setShownTarget(target);
  }

  const close = useCallback(() => {
    setIsDirty(false);
    setIsConfirmingDiscard(false);
    closeEntryDrawer();
  }, []);

  const requestClose = () => {
    if (isDirty) {
      setIsConfirmingDiscard(true);
    } else {
      close();
    }
  };

  return (
    <>
      <Sheet open={isClient && target !== null} onOpenChange={(open) => !open && requestClose()}>
        <SheetContent className="w-full gap-0 sm:max-w-lg" onOpenAutoFocus={focusPreferredField}>
          {shownTarget && (
            <DrawerBody
              key={getTargetKey(shownTarget)}
              target={shownTarget}
              onDirtyChange={setIsDirty}
              onCancel={requestClose}
              onDone={close}
            />
          )}
        </SheetContent>
      </Sheet>

      <DiscardChangesDialog open={isConfirmingDiscard} onOpenChange={setIsConfirmingDiscard} onDiscard={close} />
    </>
  );
}
