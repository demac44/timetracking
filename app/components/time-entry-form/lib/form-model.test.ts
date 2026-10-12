import { describe, expect, it } from "vitest";
import type { FormValues } from "@/app/components/time-entry-form/types/form";
import { getFirstInvalidField, validateForm, withDurationApplied, withSyncedDuration } from "./form-model";

const values: FormValues = {
  taskId: 405,
  comment: "Wrote the quarterly report",
  date: "2026-10-12",
  start: "09:00",
  end: "17:30",
  duration: "",
};

describe("form model", () => {
  it("builds a payload from valid values", () => {
    const { errors, payload } = validateForm(values);
    expect(errors).toEqual({});
    expect(payload).toMatchObject({ taskId: 405, comment: "Wrote the quarterly report" });
    expect(Date.parse(payload!.end) - Date.parse(payload!.start)).toBe(8.5 * 3_600_000);
  });

  it("lists every problem and points at the first one", () => {
    const { errors, payload } = validateForm({ ...values, taskId: null, comment: " ", start: "25:00", end: "" });
    expect(payload).toBeNull();
    expect(errors).toEqual({
      taskId: "Choose a task",
      comment: "Describe what you worked on",
      start: "Use a time like 9:30, 930 or 2pm",
      end: "Enter an end time",
    });
    expect(getFirstInvalidField(errors)).toBe("taskId");
  });

  it("treats an earlier end time as the next day", () => {
    const { payload } = validateForm({ ...values, start: "22:00", end: "01:30" });
    expect(Date.parse(payload!.end) - Date.parse(payload!.start)).toBe(3.5 * 3_600_000);
  });

  it("rejects a zero-length entry", () => {
    expect(validateForm({ ...values, end: "09:00" }).errors.end).toBe("End time must be after the start time");
  });

  it("keeps duration in sync with start and end", () => {
    expect(withSyncedDuration(values).duration).toBe("8h 30m");
  });

  it("moves the end time when a duration is typed", () => {
    const next = withDurationApplied({ ...values, duration: "1h30" });
    expect(next.end).toBe("10:30");
    expect(next.duration).toBe("1h 30m");
  });
});
