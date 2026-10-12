"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/app/components/ui/empty";
import { useRetryCountdown } from "@/app/hooks/use-retry-countdown";
import { describeApiError } from "@/app/lib/api/error-message";
import { RateLimitCountdown } from "./rate-limit-countdown";

interface PaneErrorProps {
  title: string;
  status: number;
  message: string;
  retryAt?: number;
  onRetry?: () => void;
}

export function PaneError({ title, status, message, retryAt, onRetry }: PaneErrorProps) {
  const router = useRouter();
  const [isRetrying, startTransition] = useTransition();
  const { isWaiting } = useRetryCountdown(retryAt);

  const retry = () => startTransition(() => (onRetry ? onRetry() : router.refresh()));

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {describeApiError(status, message)} {status === 429 && <RateLimitCountdown retryAt={retryAt} />}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={retry} disabled={isRetrying || isWaiting}>
          <RotateCwIcon data-icon="inline-start" className={isRetrying ? "animate-spin" : undefined} />
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  );
}
