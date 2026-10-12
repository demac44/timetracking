import { Trash2Icon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { SheetFooter } from "@/app/components/ui/sheet";
import { Spinner } from "@/app/components/ui/spinner";

interface FormFooterProps {
  isEditing: boolean;
  isPending: boolean;
  isSaveBlocked: boolean;
  onCancel: () => void;
  onDelete?: () => void;
}

export function FormFooter({ isEditing, isPending, isSaveBlocked, onCancel, onDelete }: FormFooterProps) {
  return (
    <SheetFooter className="flex-row items-center border-t">
      {onDelete && (
        <Button
          type="button"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={isPending}
          onClick={onDelete}
        >
          <Trash2Icon data-icon="inline-start" />
          Delete
        </Button>
      )}
      <div className="ml-auto flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaveBlocked}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? "Saving…" : isEditing ? "Save changes" : "Create entry"}
        </Button>
      </div>
    </SheetFooter>
  );
}
