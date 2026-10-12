"use client";

import { Button } from "@/app/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { addDays, toDateInputValue } from "@/app/lib/time/local";

interface DateFieldProps {
  id: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function today() {
  return toDateInputValue(new Date());
}

export function DateField({ id, value, error, disabled, onChange, onBlur }: DateFieldProps) {
  const errorId = `${id}-error`;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>Date</FieldLabel>
      <div className="flex gap-2">
        <Input
          id={id}
          type="date"
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className="min-w-0 flex-1"
        />
        <Button type="button" variant="outline" disabled={disabled} onClick={() => onChange(today())}>
          Today
        </Button>
        <Button type="button" variant="outline" disabled={disabled} onClick={() => onChange(addDays(today(), -1))}>
          Yesterday
        </Button>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}
