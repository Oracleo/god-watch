/** Shared TypeScript types for God Watch. */

export type StatusValue = "PENDING" | "COMPLETED" | "FAILED" | "MISSED";

export interface TaskDTO {
  id: string;
  name: string;
  color: string;
  order: number;
  archived: boolean;
  createdAt: string;
}

export interface StatusCellDTO {
  taskId: string;
  date: string;
  status: StatusValue;
}

export interface NoteDTO {
  content: string;
  updatedAt: string;
}

export interface ActivityDTO {
  id: string;
  type: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AchievementDTO {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface DashboardSummary {
  todayCompleted: number;
  todayTotal: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

export interface AnalyticsStats {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  totalFailed: number;
  totalMissed: number;
  totalPending: number;
  bestMonth: { month: string; rate: number } | null;
  worstMonth: { month: string; rate: number } | null;
}

export interface HeatmapCell {
  date: string;
  count: number;
  rate: number;
}

export interface TaskPerformance {
  taskId: string;
  name: string;
  color: string;
  completed: number;
  failed: number;
  missed: number;
  pending: number;
  rate: number;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  lifetimeCompletion: number;
  totalCompleted: number;
  totalFailed: number;
  totalMissed: number;
  totalPending: number;
  totalChecked: number;
}

