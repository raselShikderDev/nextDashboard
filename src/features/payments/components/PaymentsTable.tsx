import { Eye, Trash2, MoreHorizontal, ShieldCheck, XCircle } from "lucide-react";
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
import { Payment } from "@/types/payment.types";
import { formatCurrency, formatDate } from "@/helpers/helpers";
import { usePermission } from "@/hooks/usePermission";
import { Role } from "@/types/enums";

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
  onView: (payment: Payment) => void;
  onVerify: (payment: Payment) => void;
  onReject: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

export function PaymentsTable({
  data,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
  onLimitChange,
  onView,
  onVerify,
  onReject,
  onDelete,
}: PaymentsTableProps) {
  const { hasRole } = usePermission();
  const canManagePayments = hasRole(Role.ADMIN, Role.SUPER_ADMIN);

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
      key: "request",
      header: "Request / Guest",
      cell: (row) => (
        <div>
          <p className="text-sm font-medium">
            {row.request?.guestName || "Guest"}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.request?.requestNo || "—"} · {row.request?.guestEmail || "—"}
          </p>
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
      key: "senderNumber",
      header: "Sender",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.senderNumber || "—"}
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onView(row)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            {canManagePayments && row.status === "SUBMITTED" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-green-600 focus:text-green-600"
                  onClick={() => onVerify(row)}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verify Payment
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => onReject(row)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Payment
                </DropdownMenuItem>
              </>
            )}

            {canManagePayments && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(row)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Record
                </DropdownMenuItem>
              </>
            )}
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