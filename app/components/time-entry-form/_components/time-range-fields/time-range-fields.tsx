"use client";

import { getRange } from "@/app/components/time-entry-form/lib/form-model";
import type { FormErrors, FormField, FormValues } from "@/app/components/time-entry-form/types/form";
import { DateField } from "./_components/date-field";
import { RangeSummary } from "./_components/range-summary";
import { TimeTextField } from "./_components/time-text-field";

interface TimeRangeFieldsProps {
  idPrefix: string;
  values: FormValues;
  errors: FormErrors;
  disabled: boolean;
  onChange: (patch: Partial<FormValues>) => void;
  onBlur: (field: FormField) => void;
}

const TEXT_FIELDS = [
  { field: "start", label: "Start", placeholder: "9:00" },
  { field: "end", label: "End", placeholder: "17:30" },
  { field: "duration", label: "Duration", placeholder: "1h 30m" },
] as const;

export function TimeRangeFields({ idPrefix, values, errors, disabled, onChange, onBlur }: TimeRangeFieldsProps) {
  const range = getRange(values);

  return (
    <>
      <DateField
        id={`${idPrefix}-date`}
        value={values.date}
        error={errors.date}
        disabled={disabled}
        onChange={(date) => onChange({ date })}
        onBlur={() => onBlur("date")}
      />

      <div className="grid grid-cols-3 items-start gap-3">
        {TEXT_FIELDS.map(({ field, label, placeholder }) => (
          <TimeTextField
            key={field}
            id={`${idPrefix}-${field}`}
            label={label}
            placeholder={placeholder}
            value={values[field]}
            error={errors[field]}
            disabled={disabled}
            showNextDay={field === "end" && Boolean(range?.endsNextDay)}
            onChange={(value) => onChange({ [field]: value })}
            onBlur={() => onBlur(field)}
          />
        ))}
      </div>

      <RangeSummary range={range} />
    </>
  );
}
