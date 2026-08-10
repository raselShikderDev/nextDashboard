import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { SearchInput } from "../../../components/SearchInput";
import { UsersTable } from "../components/UsersTable";
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
  useCreateStaffMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "../api/usersApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePagination } from "../../../hooks/usePagination";
import { CreateStaffForm, type StaffFormData } from "../components/CreateStaffForm";
import type { User } from "../../../types";
import { UserViewCard } from "../components/UserViewCard";

export function UsersPage() {
  const { page, limit, goToPage, changeLimit } = usePagination();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<User | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data: usersData, isLoading } = useGetUsersQuery({
    page,
    limit,
    searchTerm: debouncedSearch || undefined,
    status: roleFilter !== "" ? roleFilter : undefined,
  });

  const [CreateStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();

  const handleCreate = async (formData: StaffFormData) => {
    try {
      await CreateStaff(formData).unwrap();
      setIsFormOpen(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleEdit = async (formData: StaffFormData) => {
    if (!selectedUser) return;
    try {
      await updateUser({ id: selectedUser.id, body: formData }).unwrap();
      setSelectedUser(null);
      setIsFormOpen(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch {
      // error handled by RTK
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleStatus(user.id).unwrap();
    } catch {
      // error handled by RTK
    }
  };

  const staffDefaultValues = selectedUser
    ? {
        name: selectedUser.userDetails?.name || "",
        email: selectedUser.email || "",
        phone: selectedUser.userDetails?.phone || "",
        role: selectedUser.role,
      }
    : undefined;

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
          placeholder="Search users by email..."
          className="flex-1 max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <UsersTable
        data={usersData?.data || []}
        total={usersData?.meta?.total || 1}
          onView={setViewTarget}

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

      <CreateStaffForm
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
          setIsFormOpen(open);
        }}
        onSubmit={selectedUser ? handleEdit : handleCreate}
        defaultValues={staffDefaultValues as any} 
        isLoading={isCreating || isUpdating}
        mode={selectedUser ? "edit" : "create"}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteTarget?.userDetails?.name || deleteTarget?.email}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />
      <UserViewCard
  user={viewTarget}
  open={!!viewTarget}
  onOpenChange={(open) => !open && setViewTarget(null)}
/>
    </PageWrapper>
  );
}