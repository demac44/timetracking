"use client";

import { useEffect } from "react";
import { RotateCwIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/app/components/ui/empty";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Empty className="min-h-dvh">
      <EmptyHeader>
        <EmptyTitle>Something went wrong</EmptyTitle>
        <EmptyDescription>We couldn’t load this page. Your saved time entries are safe.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => retry()}>
          <RotateCwIcon data-icon="inline-start" />
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  );
}
