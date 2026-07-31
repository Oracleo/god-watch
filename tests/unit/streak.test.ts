import { describe, expect, it } from "vitest";
import { computeStreaks } from "@/lib/streak";

function iso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return iso(d);
}

function day(date: string, completed: number, total = 1) {
  return { date, completed, total };
}

describe("computeStreaks", () => {
  it("returns zero streaks with no data", () => {
    const { currentStreak, longestStreak } = computeStreaks(new Map());
    expect(currentStreak).toBe(0);
    expect(longestStreak).toBe(0);
  });

  it("computes a 3-day current streak ending today", () => {
    const map = new Map([
      [daysAgo(2), day(daysAgo(2), 1)],
      [daysAgo(1), day(daysAgo(1), 1)],
      [daysAgo(0), day(daysAgo(0), 1)],
    ]);
    const { currentStreak, longestStreak } = computeStreaks(map);
    expect(currentStreak).toBe(3);
    expect(longestStreak).toBe(3);
  });

  it("keeps streak alive when today is pending but yesterday was completed", () => {
    const map = new Map([
      [daysAgo(2), day(daysAgo(2), 1)],
      [daysAgo(1), day(daysAgo(1), 1)],
    ]);
    const { currentStreak } = computeStreaks(map);
    // Today missing (pending) but yesterday completed → streak continues.
    expect(currentStreak).toBe(2);
  });

  it("breaks the streak when there is a gap", () => {
    const map = new Map([
      [daysAgo(5), day(daysAgo(5), 1)],
      [daysAgo(4), day(daysAgo(4), 1)],
      // gap
      [daysAgo(1), day(daysAgo(1), 1)],
      [daysAgo(0), day(daysAgo(0), 1)],
    ]);
    const { currentStreak, longestStreak } = computeStreaks(map);
    expect(currentStreak).toBe(2);
    expect(longestStreak).toBe(2);
  });

  it("does not count incomplete days in the longest streak", () => {
    const map = new Map([
      [daysAgo(2), day(daysAgo(2), 1)],
      [daysAgo(1), day(daysAgo(1), 0)],
      [daysAgo(0), day(daysAgo(0), 1)],
    ]);
    const { currentStreak, longestStreak } = computeStreaks(map);
    expect(longestStreak).toBe(1);
  });
});

