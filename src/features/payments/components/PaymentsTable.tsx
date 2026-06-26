import { RotateCcw, Trash2, MoreHorizontal } from "lucide-react";
import { DataTable, type Column } from "../../../components/DataTable";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { formatCurrency, formatDate, getInitials } from "@/app/helpers/helpers";
import { Payment } from "@/types/payment.types";

const methodLabels: Record<string, string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  DUTCH_BANGLA: "Dutch Bangla",
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
};

interface PaymentsTableProps {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDelete: (payment: Payment) => void;
  onRefund: (payment: Payment) => void;
}

export function PaymentsTable({
  data,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
  onLimitChange,
  onDelete,
  onRefund,
}: PaymentsTableProps) {
  const columns: Column<Payment>[] = [
    {
      key: "transactionId",
      header: "Transaction",
      cell: (row) => (
        <div>
          <p className="font-mono text-sm font-medium">{row.transactionId}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(row.createdAt)}
          </p>
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(
                row.userDetails?.userDetails?.name ||
                  row.userDetails?.userDetails?.name ||
                  "User",
              )}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium">
              {row.userDetails?.userDetails?.name ||
                row?.request?.guestName ||
                "Unknown User"}
            </p>

            <p className="text-xs text-muted-foreground">
              {row.userDetails?.email || row?.request?.guestEmail || "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(Number(row.amount))}
        </span>
      ),
    },
    {
      key: "method",
      header: "Method",
      cell: (row) => (
        <Badge variant="secondary">
          {methodLabels[row.method] ?? row.method}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <PaymentStatusBadge status={row.status} />,
    },
    {
      key: "verifiedAt",
      header: "Verified",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.verifiedAt ? formatDate(row.verifiedAt) : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {row.status === "VERIFIED" && (
              <>
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => onRefund(row)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Refund Payment
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem
              onClick={() => onDelete(row)}
              className="text-destructive focus:text-destructive hover:cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Payment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      total={total}
      page={page}
      limit={limit}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      rowKey={(row) => row.id}
      emptyTitle="No payments found"
      emptyDescription="No payments match your current filters."
    />
  );
}
