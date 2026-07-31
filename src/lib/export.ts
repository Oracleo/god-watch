"use client";

/**
 * Export utilities: CSV + PDF.
 * Runs entirely client-side (jsPDF + jspdf-autotable).
 */

export interface ExportRow {
  task: string;
  date: string;
  status: string;
  note?: string;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  MISSED: "Missed",
};

/** Download helper. */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Export rows to CSV. */
export function exportToCSV(rows: ExportRow[], filename = "god-watch-export.csv") {
  const header = ["Task", "Date", "Status"];
  const lines = [header.join(",")];
  for (const r of rows) {
    const escaped = [r.task, r.date, STATUS_LABEL[r.status] ?? r.status].map((v) =>
      `"${v.replace(/"/g, '""')}"`
    );
    lines.push(escaped.join(","));
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
}

/** Export rows to PDF (requires jspdf + jspdf-autotable). */
export async function exportToPDF(rows: ExportRow[], filename = "god-watch-export.pdf") {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(18);
  doc.text("God Watch — Export", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Every Day Leaves Evidence. Generated ${new Date().toLocaleDateString()}`, 14, 26);

  autoTable(doc, {
    head: [["Task", "Date", "Status"]],
    body: rows.map((r) => [r.task, r.date, STATUS_LABEL[r.status] ?? r.status]),
    startY: 32,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [41, 98, 255], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(filename);
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

