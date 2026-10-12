import { describe, expect, it } from "vitest";
import { addDays, buildTimeRange, roundDownToQuarter, splitLocal, toDateInputValue } from "./local";

describe("local time helpers", () => {
  it("formats a date as an input value", () => {
    expect(toDateInputValue(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("adds days across month boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("builds a same-day range", () => {
    const range = buildTimeRange("2026-10-12", 9 * 60, 17 * 60 + 30);
    expect(range.endsNextDay).toBe(false);
    expect(range.durationMinutes).toBe(8 * 60 + 30);
    expect(range.start.getHours()).toBe(9);
  });

  it("rolls an earlier end time over to the next day", () => {
    const range = buildTimeRange("2026-10-12", 22 * 60, 2 * 60);
    expect(range.endsNextDay).toBe(true);
    expect(range.durationMinutes).toBe(4 * 60);
    expect(range.end.getDate()).toBe(13);
  });

  it("splits an ISO timestamp into local date and minutes", () => {
    const iso = new Date(2026, 9, 12, 14, 45).toISOString();
    expect(splitLocal(iso)).toEqual({ date: "2026-10-12", minutes: 14 * 60 + 45 });
  });

  it("rounds down to the quarter hour", () => {
    expect(roundDownToQuarter(9 * 60 + 44)).toBe(9 * 60 + 30);
  });
});
