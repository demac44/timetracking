import { Badge } from "@/app/components/ui/badge";
import { Field, FieldError, FieldLabel } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";

interface TimeTextFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  disabled: boolean;
  showNextDay: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function TimeTextField({
  id,
  label,
  placeholder,
  value,
  error,
  disabled,
  showNextDay,
  onChange,
  onBlur,
}: TimeTextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id} className="gap-1.5">
        {label}
        {showNextDay && (
          <Badge variant="secondary" className="h-4 px-1.5 text-[0.65rem]">
            +1 day
          </Badge>
        )}
      </FieldLabel>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="tabular-nums"
      />
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}
