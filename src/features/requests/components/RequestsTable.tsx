import {
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { DataTable, type Column } from "../../../components/DataTable";
import { RequestStatusBadge } from "./RequestStatusBadge";
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
import type { Request } from "../../../types";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, getInitials } from "@/app/helpers/helpers";

const priorityConfig = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface RequestsTableProps {
  data: Request[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (r: Request) => void;
  onDelete: (r: Request) => void;
  onApprove: (r: Request) => void;
  onReject: (r: Request) => void;
}

export function RequestsTable({
  data,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: RequestsTableProps) {
  const navigate = useNavigate();
  const columns: Column<Request>[] = [
    {
      key: "user",
      header: "Requester",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {row.user ? getInitials(row.user?.userDetails.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{row.user?.userDetails.name ?? "Unknown"}</p>
            <p className="text-xs text-muted-foreground">
              {row.user?.email ?? "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      cell: (row) => (
        <div>
          <p className="text-sm font-medium max-w-[200px] truncate">
            {row.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.service?.name ?? row.serviceId}
          </p>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      cell: (row) => (
        <Badge
          variant="outline"
          className={`capitalize text-xs ${priorityConfig[row.priority]}`}
        >
          {row.priority}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <RequestStatusBadge status={row.status} />,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.createdAt)}
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
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/requests`)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {row.status === "pending" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-green-600 focus:text-green-600"
                  onClick={() => onApprove(row)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onReject(row)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(row)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
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
      isLoading={isLoading}
      total={total}
      page={page}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      rowKey={(row) => row.id}
      emptyTitle="No requests found"
      emptyDescription="No service requests match your current filters."
    />
  );
}
