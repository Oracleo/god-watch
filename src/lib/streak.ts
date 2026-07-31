/**
 * Streak calculation helpers.
 * A "streak day" is any date where the user completed at least one task.
 */

export interface DayCompletion {
  date: string; // yyyy-MM-dd
  completed: number;
  total: number;
}

/** Parse yyyy-MM-dd to a local Date at midnight. */
function parseISO(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

/** Format Date back to yyyy-MM-dd. */
function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

/** Build a set of dates where the user had any completion. */
function completionSet(dayMap: Map<string, DayCompletion>): Set<string> {
  const set = new Set<string>();
  for (const [date, day] of dayMap) {
    if (day.completed > 0) set.add(date);
  }
  return set;
}

/**
 * Compute current streak (consecutive days ending today or yesterday with completions).
 * Also computes the longest streak from the full dataset.
 */
export function computeStreaks(
  dayMap: Map<string, DayCompletion>
): { currentStreak: number; longestStreak: number } {
  const completions = completionSet(dayMap);

  // Longest streak over all data
  const sortedDates = [...completions].sort();
  let longestStreak = 0;
  let running = 0;
  let prev: Date | null = null;
  for (const date of sortedDates) {
    const d = parseISO(date);
    if (prev) {
      const diff = (d.getTime() - prev.getTime()) / 86_400_000;
      if (diff === 1) {
        running += 1;
      } else {
        running = 1;
      }
    } else {
      running = 1;
    }
    longestStreak = Math.max(longestStreak, running);
    prev = d;
  }

  // Current streak: count backwards from today; allow today to be incomplete (still counts if yesterday has completion)
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let cursor = today;
  const todayStr = toISO(cursor);
  if (!completions.has(todayStr)) {
    // Check if yesterday has completion; if so, streak continues (today pending)
    const yesterdayStr = toISO(addDays(today, -1));
    if (!completions.has(yesterdayStr)) {
      return { currentStreak: 0, longestStreak };
    }
    cursor = addDays(today, -1);
  }

  while (completions.has(toISO(cursor))) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  return { currentStreak, longestStreak };
}

