"use client";

import type { ErrorInfo } from "next/error";
import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/app/components/ui/empty";

export function PaneFallback({ title }: { title: string }, { retry }: ErrorInfo) {
  return (
    <Empty className="m-4 border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>Something unexpected went wrong. The rest of the page still works.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={() => retry()}>
          <RotateCwIcon data-icon="inline-start" />
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  );
}
