import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { SearchInput } from "../../../components/SearchInput";
import { ServiceCategoryCard } from "../components/ServiceCategoryCard";
import { ServiceCategoryForm } from "../components/ServiceCategoryForm";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllServiceCategoriesQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
  useToggleServiceCategoryStatusMutation,
} from "../api/serviceCategoryApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { useToast } from "../../../hooks/useToast";
import { usePagination } from "../../../hooks/usePagination";
import { ServiceCategory } from "@/types/service.types";
import type { ServiceCategoryFormData } from "../components/ServiceCategoryForm";

const MOCK_CATEGORIES: ServiceCategory[] = [
  {
    id: "cat-1",
    name: "Study Abroad",
    slug: "study-abroad",
    description: "Study abroad related services",
    icon: "graduation-cap",
    isActive: true,
    sortOrder: 1,
    createdAt: "2026-05-31T16:51:37.353Z",
    updatedAt: "2026-05-31T16:51:37.353Z",
  },
  {
    id: "cat-2",
    name: "Work Visa",
    slug: "work-visa",
    description: "Work visa and immigration services",
    icon: "briefcase",
    isActive: true,
    sortOrder: 2,
    createdAt: "2026-05-31T16:51:37.353Z",
    updatedAt: "2026-05-31T16:51:37.353Z",
  },
];

export function ServiceCategoriesPage() {
  const { toast } = useToast();
  const { page, limit } = usePagination();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceCategory | null>(null);

  const debouncedSearch = useDebounce(search);

  const {
    data: categoryData,
    isLoading: isGetLoading,
    isFetching: isGetFetching,
  } = useGetAllServiceCategoriesQuery({
    page,
    limit,
    searchTerm: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const [createCategory, { isLoading: isCreating }] = useCreateServiceCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateServiceCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteServiceCategoryMutation();
  const [toggleStatus] = useToggleServiceCategoryStatusMutation();

  const handleCreate = async (formData: ServiceCategoryFormData) => {
    try {
      await createCategory(formData).unwrap();
      toast({ title: "Category created successfully" });
      setIsFormOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Failed to create category" });
    }
  };

  const handleEdit = async (formData: ServiceCategoryFormData) => {
    if (!selectedCategory) return;
    try {
      await updateCategory({
        id: selectedCategory.id,
        body: formData,
      }).unwrap();
      toast({ title: "Category updated successfully" });
      setSelectedCategory(null);
      setIsFormOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Failed to update category" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id).unwrap();
      toast({ title: "Category deleted" });
      setDeleteTarget(null);
    } catch {
      toast({ variant: "destructive", title: "Failed to delete category" });
    }
  };

  const handleToggleStatus = async (category: ServiceCategory) => {
    try {
      await toggleStatus(category.id).unwrap();
      toast({
        title: `Category ${category.isActive ? "deactivated" : "activated"}`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to toggle category status",
      });
    }
  };

  const allCategories = categoryData?.data ?? MOCK_CATEGORIES;

  const filteredCategories = allCategories.filter((cat: ServiceCategory) => {
    const matchesSearch =
      !debouncedSearch ||
      cat.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && cat.isActive) ||
      (statusFilter === "inactive" && !cat.isActive);
    return matchesSearch && matchesStatus;
  });

  const showLoader = isGetLoading || isGetFetching;

  return (
    <PageWrapper>
      <PageHeader
        title="Service Categories"
        description="Manage service categories"
        actions={
          <Button
            onClick={() => {
              setSelectedCategory(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search categories..."
          className="flex-1 max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {showLoader ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <ServiceCategoryCard
              key={category.id}
              category={category}
              onEdit={(cat) => {
                setSelectedCategory(cat);
                setIsFormOpen(true);
              }}
              onDelete={setDeleteTarget}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      <ServiceCategoryForm
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedCategory(null);
          setIsFormOpen(open);
        }}
        onSubmit={selectedCategory ? handleEdit : handleCreate}
        defaultValues={selectedCategory ?? undefined}
        isLoading={isCreating || isUpdating}
        mode={selectedCategory ? "edit" : "create"}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />
    </PageWrapper>
  );
}