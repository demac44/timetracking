"use client";

import { CircleAlertIcon } from "lucide-react";
import { RateLimitCountdown } from "@/app/components/shared/rate-limit-countdown";
import { getSaveFailureTitle, isConnectionFailure } from "@/app/components/time-entry-form/lib/save-failure";
import type { SaveFailure } from "@/app/components/time-entry-form/types/save-failure";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";

interface FormErrorBannerProps {
  failure: SaveFailure;
  isEditing: boolean;
  onSaveAsNew: () => void;
}

export function FormErrorBanner({ failure, isEditing, onSaveAsNew }: FormErrorBannerProps) {
  const isMissingEntry = failure.code === 404 && isEditing;

  return (
    <Alert variant="destructive" role="alert">
      <CircleAlertIcon />
      <AlertTitle>{getSaveFailureTitle(failure, isEditing)}</AlertTitle>
      <AlertDescription>
        {isMissingEntry ? (
          <p>It may have been deleted elsewhere. Your changes are still here.</p>
        ) : (
          <p>
            {failure.message} {failure.code === 429 && <RateLimitCountdown retryAt={failure.retryAt} />}
          </p>
        )}
        {isConnectionFailure(failure) && <p>Your changes are kept, so you can try again.</p>}
        {isMissingEntry && (
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onSaveAsNew}>
            Save as new entry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
