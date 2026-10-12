import { z } from "zod";

export const MAX_COMMENT_LENGTH = 1000;
export const MAX_DURATION_MINUTES = 24 * 60;

export const timeEntrySchema = z
  .object({
    taskId: z.number({ error: "Choose a task" }).int().min(0, "Choose a task"),
    comment: z
      .string()
      .trim()
      .min(1, "Describe what you worked on")
      .max(MAX_COMMENT_LENGTH, `Keep the comment under ${MAX_COMMENT_LENGTH} characters`),
    start: z.iso.datetime({ error: "Enter a valid start time" }),
    end: z.iso.datetime({ error: "Enter a valid end time" }),
  })
  .refine((entry) => Date.parse(entry.end) > Date.parse(entry.start), {
    path: ["end"],
    error: "End time must be after the start time",
  })
  .refine((entry) => Date.parse(entry.end) - Date.parse(entry.start) <= MAX_DURATION_MINUTES * 60_000, {
    path: ["end"],
    error: "A time entry can't be longer than 24 hours",
  });

export type TimeEntryFormValues = z.input<typeof timeEntrySchema>;

export type TimeEntryFieldErrors = Partial<Record<keyof TimeEntryFormValues, string>>;

export function getFieldErrors(error: z.ZodError<TimeEntryFormValues>): TimeEntryFieldErrors {
  const fieldErrors: TimeEntryFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0] as keyof TimeEntryFormValues;
    fieldErrors[field] ??= issue.message;
  }

  return fieldErrors;
}
