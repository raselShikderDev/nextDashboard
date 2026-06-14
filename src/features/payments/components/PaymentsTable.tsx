import { RotateCcw, Trash2, MoreHorizontal } from "lucide-react";
import { DataTable, type Column } from "../../../components/DataTable";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { formatCurrency, formatDate, getInitials } from "../../../lib/utils";
import type { Payment } from "../../../types";

const methodLabels: Record<string, string> = { credit_card: "Credit Card", bank_transfer: "Bank Transfer", cash: "Cash", online: "Online" };

interface PaymentsTableProps {
  data: Payment[]; total: number; page: number; limit: number; isLoading: boolean;
  onPageChange: (page: number) => void; onLimitChange: (limit: number) => void;
  onDelete: (p: Payment) => void; onRefund: (p: Payment) => void;
}

export function PaymentsTable({ data, total, page, limit, isLoading, onPageChange, onLimitChange, onDelete, onRefund }: PaymentsTableProps) {
  const columns: Column<Payment>[] = [
    { key: "transactionId", header: "Transaction", cell: (row) => (
      <div><p className="text-sm font-mono font-medium">{row.transactionId ?? `TXN-${row.id.slice(-6).toUpperCase()}`}</p><p className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</p></div>
    )},
    { key: "user", header: "User", cell: (row) => (
      <div className="flex items-center gap-2.5">
        <Avatar className="w-8 h-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{row.user ? getInitials(row.user.name) : "?"}</AvatarFallback></Avatar>
        <div><p className="text-sm font-medium">{row.user?.name ?? "Unknown"}</p><p className="text-xs text-muted-foreground">{row.user?.email ?? "-"}</p></div>
      </div>
    )},
    { key: "amount", header: "Amount", cell: (row) => <span className="font-semibold tabular-nums text-base">{formatCurrency(row.amount)}</span> },
    { key: "method", header: "Method", cell: (row) => <Badge variant="secondary" className="text-xs">{methodLabels[row.method] ?? row.method}</Badge> },
    { key: "status", header: "Status", cell: (row) => <PaymentStatusBadge status={row.status} /> },
    { key: "paidAt", header: "Paid At", cell: (row) => <span className="text-sm text-muted-foreground">{row.paidAt ? formatDate(row.paidAt) : "-"}</span> },
    { key: "actions", header: "", className: "w-12 text-right", cell: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {row.status === "paid" && <DropdownMenuItem onClick={() => onRefund(row)}><RotateCcw className="w-4 h-4 mr-2" />Refund</DropdownMenuItem>}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(row)}><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];
  return <DataTable columns={columns} data={data} isLoading={isLoading} total={total} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} rowKey={(row) => row.id} emptyTitle="No payments found" emptyDescription="No payments match your current filters." />;
}
