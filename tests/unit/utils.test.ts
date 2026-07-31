import { describe, expect, it } from "vitest";
import {
  cn,
  formatDateShort,
  percent,
  pluralize,
  rangeISODates,
  toISODate,
  truncate,
} from "@/lib/utils";

describe("utils", () => {
  it("cn merges tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", null, undefined, false)).toBe("text-red-500");
  });

  it("toISODate formats local date as yyyy-MM-dd", () => {
    const d = new Date(2024, 0, 5); // Jan 5, 2024 local
    expect(toISODate(d)).toBe("2024-01-05");
  });

  it("formatDateShort returns short label", () => {
    const d = new Date(2024, 0, 5);
    expect(formatDateShort(d)).toContain("Jan");
    expect(formatDateShort(d)).toContain("5");
  });

  it("rangeISODates includes both endpoints", () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 3);
    const range = rangeISODates(start, end);
    expect(range).toEqual(["2024-01-01", "2024-01-02", "2024-01-03"]);
  });

  it("percent computes and rounds", () => {
    expect(percent(3, 4)).toBe(75);
    expect(percent(0, 10)).toBe(0);
    expect(percent(1, 3)).toBe(33);
  });

  it("pluralize handles singular and plural", () => {
    expect(pluralize(1, "day")).toBe("1 day");
    expect(pluralize(3, "day")).toBe("3 days");
  });

  it("truncate shortens long strings", () => {
    expect(truncate("hello", 3)).toBe("hel…");
    expect(truncate("hi")).toBe("hi");
  });
});

