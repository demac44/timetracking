import { describe, expect, it } from "vitest";
import { getFieldErrors, timeEntrySchema } from "./time-entry";

const valid = {
  taskId: 405,
  comment: "Worked on the report",
  start: "2026-10-12T09:00:00.000Z",
  end: "2026-10-12T17:00:00.000Z",
};

describe("timeEntrySchema", () => {
  it("accepts a valid entry and trims the comment", () => {
    const result = timeEntrySchema.safeParse({ ...valid, comment: "  Report  " });
    expect(result.success && result.data.comment).toBe("Report");
  });

  it("accepts task id 0", () => {
    expect(timeEntrySchema.safeParse({ ...valid, taskId: 0 }).success).toBe(true);
  });

  it("reports a missing task and an empty comment", () => {
    const result = timeEntrySchema.safeParse({ ...valid, taskId: null, comment: "   " });
    expect(result.success).toBe(false);
    expect(getFieldErrors(result.error!)).toMatchObject({
      taskId: "Choose a task",
      comment: "Describe what you worked on",
    });
  });

  it("rejects an end before the start", () => {
    const result = timeEntrySchema.safeParse({ ...valid, end: "2026-10-12T08:00:00.000Z" });
    expect(getFieldErrors(result.error!).end).toBe("End time must be after the start time");
  });

  it("rejects entries longer than 24 hours", () => {
    const result = timeEntrySchema.safeParse({ ...valid, end: "2026-10-13T09:30:00.000Z" });
    expect(getFieldErrors(result.error!).end).toBe("A time entry can't be longer than 24 hours");
  });
});
