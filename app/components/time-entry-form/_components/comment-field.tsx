import { Field, FieldDescription, FieldError, FieldLabel } from "@/app/components/ui/field";
import { Textarea } from "@/app/components/ui/textarea";
import { MAX_COMMENT_LENGTH } from "@/app/lib/validation/time-entry";

interface CommentFieldProps {
  id: string;
  errorId: string;
  value: string;
  error?: string;
  disabled: boolean;
  autoFocus: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function CommentField({ id, errorId, value, error, disabled, autoFocus, onChange, onBlur }: CommentFieldProps) {
  const counterId = `${id}-count`;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>What did you work on?</FieldLabel>
      <Textarea
        id={id}
        value={value}
        placeholder="e.g. Reviewed the design mockups with the client"
        rows={3}
        maxLength={MAX_COMMENT_LENGTH}
        disabled={disabled}
        data-autofocus={autoFocus || undefined}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${counterId} ${errorId}` : counterId}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="resize-y"
      />
      <div className="flex items-start justify-between gap-3">
        <FieldError id={errorId}>{error}</FieldError>
        <FieldDescription id={counterId} className="ml-auto shrink-0 text-xs tabular-nums">
          {value.length}/{MAX_COMMENT_LENGTH}
        </FieldDescription>
      </div>
    </Field>
  );
}
