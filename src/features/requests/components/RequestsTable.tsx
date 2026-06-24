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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, getInitials } from "@/app/helpers/helpers";
import { ServiceRequest } from "@/types/request.types";

interface RequestsTableProps {
  data: ServiceRequest[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (r: ServiceRequest) => void;
  onDelete: (r: ServiceRequest) => void;
  onApprove: (r: ServiceRequest) => void;
  onReject: (r: ServiceRequest) => void;
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
  const columns: Column<ServiceRequest>[] = [
    {
      key: "user",
      header: "Requester",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {row?.guestName
                ? getInitials(row?.guestName)
                : getInitials(row?.user?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {row?.guestName
                ? getInitials(row?.guestName)
                : getInitials(row?.user?.name)}
            </p>
            <p className="text-xs text-muted-foreground">
              {row?.guestEmail ?? "-"}
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
            {row?.service?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.service?.name ?? row.serviceId}
          </p>
        </div>
      ),
    },
    // {
    //   key: "priority",
    //   header: "Priority",
    //   cell: (row) => (
    //     <Badge
    //       variant="outline"
    //       className={`capitalize text-xs ${priorityConfig[row.priority]}`}
    //     >
    //       {row.priority}
    //     </Badge>
    //   ),
    // },
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
          {formatCurrency(Number(row?.service?.price))}
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
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => navigate(`/requests`)}
            >
              <Eye className="w-4 h-4 mr-2 hover:cursor-pointer" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => onEdit(row)}
            >
              <Pencil className="w-4 h-4 mr-2 " />
              Edit
            </DropdownMenuItem>
            {row?.status === "PENDING" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-green-600 focus:text-green-600 hover:cursor-pointer"
                  onClick={() => onApprove(row)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive hover:cursor-pointer"
                  onClick={() => onReject(row)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive hover:cursor-pointer"
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
