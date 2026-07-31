/**
 * Inspirational quotes shown on the dashboard and month separators.
 * These are also seeded into the database (see prisma/seed.ts).
 */

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: "Every day leaves evidence.", author: "God Watch" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Motivation gets you going, but discipline keeps you growing.", author: "John C. Maxwell" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { text: "A river cuts through rock not because of its power, but because of its persistence.", author: "James N. Watkins" },
  { text: "You will never change your life until you change something you do daily.", author: "Mike Murdock" },
  { text: "Winners are not people who never fail, but people who never quit.", author: "Edwin Louis Cole" },
  { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
  { text: "The pain of discipline is light compared to the pain of regret.", author: "Unknown" },
  { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "Success is a few simple disciplines practiced every day.", author: "Jim Rohn" },
  { text: "Do not wait for the perfect moment; take the moment and make it perfect.", author: "Unknown" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Habit is a cable; we weave a thread of it each day, and at last we cannot break it.", author: "Horace Mann" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
];

/** Return a deterministic quote based on a seed (e.g., date string). */
export function getQuoteForDate(dateStr: string): Quote {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % QUOTES.length;
  return QUOTES[index] ?? QUOTES[0]!;
}

/** Return a random quote for the dashboard. */
export function getRandomQuote(): Quote {
  const index = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[index] ?? QUOTES[0]!;
}

