/**
 * Achievement badge definitions & evaluation logic.
 * Criteria are stored as JSON in the DB; these are the canonical definitions.
 */

export type AchievementCriteriaType =
  | "CURRENT_STREAK_DAYS"
  | "LONGEST_STREAK_DAYS"
  | "TOTAL_COMPLETED"
  | "TOTAL_CHECKED"
  | "PERFECT_DAY"
  | "PERFECT_WEEK"
  | "FIRST_COMPLETION";

export interface AchievementCriteria {
  type: AchievementCriteriaType;
  value: number; // threshold
}

export interface AchievementDefinition {
  key: string;
  name: string;
  description: string;
  icon: string;
  criteria: AchievementCriteria;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    key: "first_step",
    name: "First Step",
    description: "Complete your first task.",
    icon: "👣",
    criteria: { type: "FIRST_COMPLETION", value: 1 },
  },
  {
    key: "streak_3",
    name: "Spark",
    description: "Reach a 3-day streak.",
    icon: "🔥",
    criteria: { type: "CURRENT_STREAK_DAYS", value: 3 },
  },
  {
    key: "streak_7",
    name: "Week Warrior",
    description: "Reach a 7-day streak.",
    icon: "⚡",
    criteria: { type: "CURRENT_STREAK_DAYS", value: 7 },
  },
  {
    key: "streak_30",
    name: "Unstoppable",
    description: "Reach a 30-day streak.",
    icon: "🚀",
    criteria: { type: "CURRENT_STREAK_DAYS", value: 30 },
  },
  {
    key: "streak_100",
    name: "Legendary",
    description: "Reach a 100-day streak.",
    icon: "👑",
    criteria: { type: "CURRENT_STREAK_DAYS", value: 100 },
  },
  {
    key: "streak_longest_30",
    name: "Iron Will",
    description: "Achieve a longest streak of 30 days.",
    icon: "🛡️",
    criteria: { type: "LONGEST_STREAK_DAYS", value: 30 },
  },
  {
    key: "total_100",
    name: "Century",
    description: "Complete 100 tasks in total.",
    icon: "💯",
    criteria: { type: "TOTAL_COMPLETED", value: 100 },
  },
  {
    key: "total_500",
    name: "Machine",
    description: "Complete 500 tasks in total.",
    icon: "🤖",
    criteria: { type: "TOTAL_COMPLETED", value: 500 },
  },
  {
    key: "perfect_day",
    name: "Perfect Day",
    description: "Complete every task for a single day.",
    icon: "🌟",
    criteria: { type: "PERFECT_DAY", value: 1 },
  },
  {
    key: "perfect_week",
    name: "Flawless Week",
    description: "Complete every task for 7 consecutive days.",
    icon: "💎",
    criteria: { type: "PERFECT_WEEK", value: 7 },
  },
];

/** Evaluate which achievements are newly unlocked given user stats. */
export function evaluateAchievements(
  definitions: AchievementDefinition[],
  stats: {
    currentStreak: number;
    longestStreak: number;
    totalCompleted: number;
    totalChecked: number;
    perfectDayCount: number;
    perfectWeekCount: number;
  }
): string[] {
  const unlocked: string[] = [];
  for (const def of definitions) {
    const c = def.criteria;
    let met = false;
    switch (c.type) {
      case "FIRST_COMPLETION":
        met = stats.totalCompleted >= c.value;
        break;
      case "CURRENT_STREAK_DAYS":
        met = stats.currentStreak >= c.value;
        break;
      case "LONGEST_STREAK_DAYS":
        met = stats.longestStreak >= c.value;
        break;
      case "TOTAL_COMPLETED":
        met = stats.totalCompleted >= c.value;
        break;
      case "TOTAL_CHECKED":
        met = stats.totalChecked >= c.value;
        break;
      case "PERFECT_DAY":
        met = stats.perfectDayCount >= c.value;
        break;
      case "PERFECT_WEEK":
        met = stats.perfectWeekCount >= c.value;
        break;
    }
    if (met) unlocked.push(def.key);
  }
  return unlocked;
}

