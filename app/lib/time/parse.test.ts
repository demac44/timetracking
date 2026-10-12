import { describe, expect, it } from "vitest";
import { formatDuration, formatTimeOfDay, parseDuration, parseTimeOfDay } from "./parse";

describe("parseTimeOfDay", () => {
  it.each([
    ["9", 9 * 60],
    ["17", 17 * 60],
    ["930", 9 * 60 + 30],
    ["0930", 9 * 60 + 30],
    ["1230", 12 * 60 + 30],
    ["9:30", 9 * 60 + 30],
    ["9.30", 9 * 60 + 30],
    ["9a", 9 * 60],
    ["9 am", 9 * 60],
    ["1pm", 13 * 60],
    ["1:30pm", 13 * 60 + 30],
    ["12am", 0],
    ["12pm", 12 * 60],
    ["00:00", 0],
    ["23:59", 23 * 60 + 59],
  ])("parses %s", (input, expected) => {
    expect(parseTimeOfDay(input)).toBe(expected);
  });

  it.each(["", "24", "2400", "9:60", "13pm", "0am", "abc", "9:3"])("rejects %s", (input) => {
    expect(parseTimeOfDay(input)).toBeNull();
  });
});

describe("parseDuration", () => {
  it.each([
    ["90", 90],
    ["45", 45],
    ["1.5", 90],
    ["1,5", 90],
    ["1:30", 90],
    ["1h30", 90],
    ["1h 30m", 90],
    ["1h", 60],
    ["1.5h", 90],
    ["30m", 30],
    ["45 min", 45],
    ["2 hours", 120],
  ])("parses %s", (input, expected) => {
    expect(parseDuration(input)).toBe(expected);
  });

  it.each(["", "abc", "1:75", "h", "1x"])("rejects %s", (input) => {
    expect(parseDuration(input)).toBeNull();
  });
});

describe("formatting", () => {
  it("formats times of day with leading zeros", () => {
    expect(formatTimeOfDay(9 * 60 + 5)).toBe("09:05");
    expect(formatTimeOfDay(24 * 60 + 30)).toBe("00:30");
  });

  it("formats durations compactly", () => {
    expect(formatDuration(45)).toBe("45m");
    expect(formatDuration(120)).toBe("2h");
    expect(formatDuration(450)).toBe("7h 30m");
  });
});
