/** Global constants for God Watch. */

export const APP_NAME = "God Watch";
export const APP_TAGLINE = "Every Day Leaves Evidence.";
export const APP_FOOTER = "Invented by Devnetra Consultancy";
export const APP_CONTACT_EMAIL = "dr.neeconnect@gmail.com";

/** Status cycle order for the cell click handler. */
export const STATUS_CYCLE = ["PENDING", "COMPLETED", "FAILED", "MISSED"] as const;

/** Encouraging toasts per status selection. */
export const STATUS_TOASTS: Record<string, string> = {
  COMPLETED: "Amazing! Another day, another win. Keep going! 🔥",
  FAILED: "A miss is a lesson. Tomorrow is a fresh start. 💪",
  MISSED: "Life happens. Don't break the chain — get back to it! ⏳",
  PENDING: "Reverted to pending. No pressure — just show up.",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  MISSED: "Missed",
};

/** Task color palette (hex). */
export const TASK_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#84cc16", // lime
  "#f97316", // orange
  "#64748b", // slate
] as const;

/** Heatmap intensity levels (0-4). */
export const HEATMAP_LEVELS = 4;

/** Keyboard shortcuts help content. */
export const SHORTCUTS = [
  { keys: "1", label: "Mark as Completed" },
  { keys: "2", label: "Mark as Failed" },
  { keys: "3", label: "Mark as Missed" },
  { keys: "0", label: "Mark as Pending" },
  { keys: "↑ / ↓", label: "Navigate cells" },
  { keys: "Enter", label: "Toggle cell" },
  { keys: "Cmd/Ctrl + K", label: "Search" },
  { keys: "Cmd/Ctrl + Z", label: "Undo last action" },
] as const;

