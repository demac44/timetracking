"use client";

import { FileQuestionIcon } from "lucide-react";
import { openEntryDrawer } from "@/app/components/entry-drawer/lib/drawer-navigation";
import { Button } from "@/app/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/app/components/ui/empty";

interface EntryNotFoundProps {
  id: number;
  onClose: () => void;
}

export function EntryNotFound({ id, onClose }: EntryNotFoundProps) {
  return (
    <Empty className="mx-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestionIcon />
        </EmptyMedia>
        <EmptyTitle>Time entry #{id} doesn’t exist</EmptyTitle>
        <EmptyDescription>It may have been deleted, or the link is wrong.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => openEntryDrawer({ mode: "new", taskId: null })}>Create a new entry</Button>
      </EmptyContent>
    </Empty>
  );
}
