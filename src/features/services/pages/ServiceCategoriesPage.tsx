import { useState } from "react";
import { Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
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
import { ServiceCategory } from "@/types/service.types";
import type { ServiceCategoryFormData } from "../components/ServiceCategoryForm";

// Only used in development when API is unavailable
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
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceCategory | null>(
    null,
  );

  const debouncedSearch = useDebounce(search, 300);

  const {
    data: categoryData,
    isLoading: isGetLoading,
    isFetching: isGetFetching,
    isError,
  } = useGetAllServiceCategoriesQuery({
    page,
    limit,
    searchTerm: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const [createCategory, { isLoading: isCreating }] =
    useCreateServiceCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateServiceCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteServiceCategoryMutation();
  const [toggleStatus] = useToggleServiceCategoryStatusMutation();

  const handleCreate = async (formData: ServiceCategoryFormData) => {
    const payload = {
      ...formData,
      slug: formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-"),
    };
    try {
      await createCategory(payload).unwrap();
      toast({ title: "Category created successfully" });
      setIsFormOpen(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to create category",
        description: err?.data?.message || "Please try again",
      });
    }
  };

  const handleEdit = async (formData: ServiceCategoryFormData) => {
    if (!selectedCategory) return;
    const payload = {
      ...formData,
      slug: formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-"),
    };
    try {
      await updateCategory({
        id: selectedCategory.id,
        body: payload,
      }).unwrap();
      toast({ title: "Category updated successfully" });
      setSelectedCategory(null);
      setIsFormOpen(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to update category",
        description: err?.data?.message || "Please try again",
      });
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

  // Use API data; fallback to mocks ONLY in dev when API hasn't loaded yet
  const categories =
    categoryData?.data ?? (import.meta.env.DEV ? MOCK_CATEGORIES : []);
  const totalItems = categoryData?.meta?.total ?? categories.length;
  const totalPages = Math.ceil(totalItems / limit);
  const showLoader = isGetLoading || isGetFetching;
  const isEmpty = !showLoader && categories.length === 0;

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
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue className="cursor-pointer" placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="all">
              All Status
            </SelectItem>
            <SelectItem className="cursor-pointer" value="active">
              Active
            </SelectItem>
            <SelectItem className="cursor-pointer" value="inactive">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {showLoader ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : isEmpty ? (
        <div className="flex h-96 flex-col items-center justify-center text-muted-foreground">
          <p className="text-lg font-medium">No categories found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
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
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
        variant="destructive"
      />
    </PageWrapper>
  );
}
