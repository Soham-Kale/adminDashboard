"use client";

import { Search, Download, X } from "lucide-react";
import { exportToCsv } from "@/lib/utils/exportHelpers";
import type { Table } from "@tanstack/react-table";
import toast from "react-hot-toast";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  exportFilename?: string;
  placeholder?: string;
  children?: React.ReactNode;
}

export function TableToolbar<TData>({
  table,
  exportFilename = "export",
  placeholder = "Search…",
  children,
}: TableToolbarProps<TData>) {
  const globalFilter = table.getState().globalFilter ?? "";

  function handleExport() {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToCsv(rows as Record<string, unknown>[], exportFilename);
    toast.success(`Exported ${rows.length} rows to CSV`);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-48 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        />
        {globalFilter && (
          <button
            onClick={() => table.setGlobalFilter("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {children}

      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-2 bg-background border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Download className="h-3.5 w-3.5" />
        Export CSV
      </button>
    </div>
  );
}
