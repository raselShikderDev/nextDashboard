import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { SearchInput } from "../../../components/SearchInput";
import { UsersTable } from "../components/UsersTable";
import { UserForm } from "../components/UserForm";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "../api/usersApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePagination } from "../../../hooks/usePagination";
import type { User } from "../../../types";
import type { UserFormData } from "../../../lib/validators";

const NAMES = [
  "Alice Johnson",
  "Bob Smith",
  "Carol White",
  "David Lee",
  "Eva Martinez",
  "Frank Brown",
  "Grace Kim",
  "Henry Davis",
  "Isla Wilson",
  "Jack Moore",
];
const MOCK_USERS: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: `user-${i}`,
  name: NAMES[i],
  email: `user${i}@example.com`,
  role: (["admin", "manager", "user", "user", "user"] as const)[i % 5],
  department: ["Engineering", "Design", "Marketing", "Sales", "HR"][i % 5],
  phone: `+1 555 000 ${String(i).padStart(4, "0")}`,
  isActive: i % 5 !== 3,
  createdAt: new Date(Date.now() - i * 86400000 * 30).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export function UsersPage() {
  // const { toast } = useToast();
  const { page, limit, goToPage, changeLimit } = usePagination();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useGetUsersQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: roleFilter !== "all" ? roleFilter : undefined,
  });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();

  const handleCreate = async (formData: UserFormData) => {
    try {
      await createUser(formData).unwrap();
      // toast({ title: "User created successfully" });
      setIsFormOpen(false);
    } catch {
      // toast({ variant: "destructive", title: "Failed to create user" });
    }
  };
  const handleEdit = async (formData: UserFormData) => {
    if (!selectedUser) return;
    try {
      await updateUser({ id: selectedUser.id, body: formData }).unwrap();
      // toast({ title: "User updated successfully" });
      setSelectedUser(null);
      setIsFormOpen(false);
    } catch {
      // toast({ variant: "destructive", title: "Failed to update user" });
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id).unwrap();
      // toast({ title: "User deleted" });
      setDeleteTarget(null);
    } catch {
      toast({ variant: "destructive", title: "Failed to delete user" });
    }
  };
  const handleToggleStatus = async (user: User) => {
    try {
      await toggleStatus(user.id).unwrap();
      // toast({ title: `User ${user.isActive ? "deactivated" : "activated"}` });
    } catch {
      // toast({ variant: "destructive", title: "Failed to update user status" });
    }
  };

  const displayData = data ?? {
    data: MOCK_USERS,
    total: 52,
    page: 1,
    limit: 10,
    totalPages: 6,
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Users"
        description="Manage user accounts and permissions"
        actions={
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        }
      />
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3 mb-5"
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search users..."
          className="flex-1 max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      <UsersTable
        data={displayData.data}
        total={displayData.total}
        page={page}
        limit={limit}
        isLoading={isLoading}
        onPageChange={goToPage}
        onLimitChange={changeLimit}
        onEdit={(user) => {
          setSelectedUser(user);
          setIsFormOpen(true);
        }}
        onDelete={setDeleteTarget}
        onToggleStatus={handleToggleStatus}
      />
      <UserForm
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
          setIsFormOpen(open);
        }}
        onSubmit={selectedUser ? handleEdit : handleCreate}
        defaultValues={selectedUser ?? undefined}
        isLoading={isCreating || isUpdating}
        mode={selectedUser ? "edit" : "create"}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />
    </PageWrapper>
  );
}
