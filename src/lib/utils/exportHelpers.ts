"use client";

import Papa from "papaparse";
import { format } from "date-fns";

export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportToPdf(
  tableData: Record<string, unknown>[],
  title: string,
  columns: string[]
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), "MMM dd, yyyy HH:mm")}`, 14, 28);

  const headers = columns;
  const rows = tableData.map((row) =>
    columns.map((col) => String(row[col] ?? ""))
  );

  let y = 40;
  const colWidth = (270 - 14) / columns.length;

  doc.setFillColor(50, 50, 50);
  doc.rect(14, y - 5, 270, 8, "F");
  doc.setTextColor(255, 255, 255);
  headers.forEach((h, i) => doc.text(h, 14 + i * colWidth, y));

  doc.setTextColor(0, 0, 0);
  rows.forEach((row, ri) => {
    y += 8;
    if (y > 180) {
      doc.addPage();
      y = 20;
    }
    if (ri % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(14, y - 5, 270, 8, "F");
    }
    row.forEach((cell, ci) => doc.text(cell.slice(0, 20), 14 + ci * colWidth, y));
  });

  doc.save(`${title}-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}
