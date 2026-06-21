import { type ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { cn } from "../lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  rowKey: (row: T) => string;
}

export function DataTable<T>({ columns, data, isLoading, total = 0, page = 1, limit = 10, onPageChange, onLimitChange, emptyTitle = "No data found", emptyDescription = "There are no items to display.", className, rowKey }: DataTableProps<T>) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48">
                  <LoadingSpinner className="h-full" text="Loading data..." />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={rowKey(row)} className="hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>{col.cell(row)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > 0 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select value={String(limit)} onValueChange={(v) => onLimitChange?.(Number(v))}>
              <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((l) => (<SelectItem key={l} value={String(l)}>{l}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(1)} disabled={page === 1}><ChevronsLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(page - 1)} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <Button key={p} variant={p === page ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => onPageChange(p)}>{p}</Button>
              );
            })}
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}><ChevronsRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
