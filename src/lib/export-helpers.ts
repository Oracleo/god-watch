/**
 * Export helper (no "use client" — safe for Server Components).
 * Pure functions to build export rows from DB data.
 */

export interface ExportRow {
  task: string;
  date: string;
  status: string;
  note?: string;
}

/** Build export rows from a date→status map. */
export function buildExportRows(
  tasks: { id: string; name: string }[],
  statuses: Record<string, Record<string, string>>,
  days: string[]
): ExportRow[] {
  const rows: ExportRow[] = [];
  for (const task of tasks) {
    for (const date of days) {
      const status = statuses[task.id]?.[date] ?? "PENDING";
      rows.push({ task: task.name, date, status });
    }
  }
  return rows;
}
