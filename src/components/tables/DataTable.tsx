"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/components/shared/EmptyState";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  toolbar?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode;
  className?: string;
  pageSize?: number;
  /** Server-side pagination — pass when the API pages data, not the client */
  serverPagination?: {
    totalRows: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

export function DataTable<TData>({
  columns,
  data,
  toolbar,
  className,
  pageSize = 10,
  serverPagination,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const isServer = Boolean(serverPagination);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: isServer ? undefined : globalFilter,
      ...(isServer && serverPagination
        ? { pagination: { pageIndex: serverPagination.page - 1, pageSize: serverPagination.pageSize } }
        : {}),
    },
    manualPagination: isServer,
    pageCount: isServer && serverPagination
      ? Math.ceil(serverPagination.totalRows / serverPagination.pageSize)
      : undefined,
    onSortingChange: setSorting,
    onGlobalFilterChange: isServer ? undefined : setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: isServer ? getCoreRowModel() : getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div className={cn("space-y-3", className)}>
      {toolbar?.(table)}

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-4 py-3 text-left text-xs font-medium text-muted-foreground whitespace-nowrap",
                          canSort && "cursor-pointer select-none hover:text-foreground"
                        )}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-muted-foreground/50">
                              {sorted === "asc" ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : sorted === "desc" ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronsUpDown className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8">
                    <EmptyState title="No results found" description="Try adjusting your search or filters." />
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/30 transition-colors even:bg-muted/10"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {isServer && serverPagination
            ? `${((serverPagination.page - 1) * serverPagination.pageSize) + 1}–${Math.min(serverPagination.page * serverPagination.pageSize, serverPagination.totalRows)} of ${serverPagination.totalRows.toLocaleString()} records`
            : `Showing ${table.getRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} results`}
        </span>
        <div className="flex items-center gap-2">
          <select
            value={isServer && serverPagination ? serverPagination.pageSize : table.getState().pagination.pageSize}
            onChange={(e) => {
              const s = Number(e.target.value);
              if (isServer && serverPagination) { serverPagination.onPageSizeChange(s); serverPagination.onPageChange(1); }
              else table.setPageSize(s);
            }}
            className="bg-background border border-border rounded px-2 py-1 text-xs"
          >
            {[25, 50, 100].map((s) => (
              <option key={s} value={s}>{s} per page</option>
            ))}
          </select>
          <button
            onClick={() => isServer && serverPagination
              ? serverPagination.onPageChange(serverPagination.page - 1)
              : table.previousPage()}
            disabled={isServer && serverPagination ? serverPagination.page <= 1 : !table.getCanPreviousPage()}
            className="px-2 py-1 border border-border rounded disabled:opacity-40 hover:bg-accent transition-colors"
          >
            ←
          </button>
          <span>
            Page {isServer && serverPagination ? serverPagination.page : table.getState().pagination.pageIndex + 1}
            {" "}of{" "}
            {isServer && serverPagination
              ? Math.ceil(serverPagination.totalRows / serverPagination.pageSize)
              : table.getPageCount()}
          </span>
          <button
            onClick={() => isServer && serverPagination
              ? serverPagination.onPageChange(serverPagination.page + 1)
              : table.nextPage()}
            disabled={isServer && serverPagination
              ? serverPagination.page >= Math.ceil(serverPagination.totalRows / serverPagination.pageSize)
              : !table.getCanNextPage()}
            className="px-2 py-1 border border-border rounded disabled:opacity-40 hover:bg-accent transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
