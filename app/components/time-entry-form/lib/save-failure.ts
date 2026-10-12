import type { SaveFailure } from "@/app/components/time-entry-form/types/save-failure";

export function isConnectionFailure({ code }: SaveFailure) {
  return code === 0 || code >= 500;
}

export function getSaveFailureTitle(failure: SaveFailure, isEditing: boolean) {
  if (failure.code === 404 && isEditing) {
    return "This entry no longer exists";
  }

  if (failure.code === 422) {
    return "Check the highlighted fields";
  }

  if (failure.code === 429) {
    return "Too many requests";
  }

  if (isConnectionFailure(failure)) {
    return "Couldn't reach Memtime";
  }

  return "Memtime couldn't save this entry";
}
