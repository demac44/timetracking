import { describe, expect, it } from "vitest";
import { buildEntriesHref, DEFAULT_ENTRIES_QUERY, parseEntriesQuery } from "./search-params";

describe("entries query", () => {
  it("falls back to defaults for missing or invalid values", () => {
    expect(parseEntriesQuery({ page: "-2", size: "7", sort: "userId", order: "up" })).toEqual(DEFAULT_ENTRIES_QUERY);
  });

  it("parses valid values", () => {
    expect(parseEntriesQuery({ page: "3", size: "25", sort: "createdAt", order: "asc" })).toEqual({
      page: 3,
      size: 25,
      sort: "createdAt",
      order: "asc",
    });
  });

  it("omits defaults when building links", () => {
    expect(buildEntriesHref(DEFAULT_ENTRIES_QUERY)).toBe("/");
    expect(buildEntriesHref(DEFAULT_ENTRIES_QUERY, { page: 2 })).toBe("/?page=2");
  });
});
