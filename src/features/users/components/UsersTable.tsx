import {
  Pencil,
  Trash2,
  MoreHorizontal,
  ShieldCheck,
  UserX,
  UserCheck,
  Eye,
} from "lucide-react";
import { DataTable, type Column } from "../../../components/DataTable";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import type { User } from "../../../types";
import { formatDate, getInitials } from "@/app/helpers/helpers";

const roleConfig: Record<string, string> = {
  ADMIN:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  USER: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  SUPER_ADMIN:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

interface UsersTableProps {
  data: User[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (u: User) => void;      // ✅ NEW
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
  onToggleStatus: (u: User) => void;
}

export function UsersTable({
  data,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: UsersTableProps) {
  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={row.userDetails?.avatarUrl || ""} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
              {getInitials(row.userDetails?.name || row.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{row.userDetails?.name || "—"}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (row) => (
        <Badge
          variant="outline"
          className={`capitalize text-xs ${roleConfig[row.role] || roleConfig.USER}`}
        >
          <ShieldCheck className="w-3 h-3 mr-1" />
          {row.role.toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant={row.isActive ? "default" : "secondary"}
          className={
            row.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200"
              : ""
          }
        >
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.userDetails?.phone || "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
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
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onView(row)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onEdit(row)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem> */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onToggleStatus(row)}
            >
              {row.isActive ? (
                <>
                  <UserX className="w-4 h-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => onDelete(row)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem> */}
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
      emptyTitle="No users found"
      emptyDescription="No users match your current search or filters."
    />
  );
}