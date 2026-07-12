import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { SearchInput } from "../../../components/SearchInput";
import { ServiceForm } from "../components/ServiceForm";
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
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useToggleServiceStatusMutation,
  useGetServiceCategoriesQuery,
} from "../api/servicesApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { useToast } from "../../../hooks/useToast";
import type { ServiceFormData } from "../../../lib/validators";
import { Service, ServiceCategory } from "@/types/service.types";
import { usePagination } from "../../../hooks/usePagination";
import { ServiceCard } from "../components/ServicesGrid";

const MOCK_SERVICES: Service[] = Array.from({ length: 9 }, (_, i) => ({
  id: `svc-${i}`,
  categoryId: `cat-${i % 3}`,
  name: [
    "Web Development",
    "UI/UX Design",
    "Data Analytics",
    "Cloud Hosting",
    "IT Support",
    "Cybersecurity",
    "Mobile Development",
    "SEO Optimization",
    "DevOps Consulting",
  ][i],
  slug: [
    "web-development",
    "ui-ux-design",
    "data-analytics",
    "cloud-hosting",
    "it-support",
    "cybersecurity",
    "mobile-development",
    "seo-optimization",
    "devops-consulting",
  ][i],
  description:
    "Professional service offering with enterprise-grade quality and 24/7 support included.",
  features: ["Enterprise support", "Custom integration", "24/7 monitoring"],
  deliverables: ["Source code", "Documentation", "Deployment guide"],
  turnaround: "3-5 business days",
  price: String([2499, 1499, 1999, 299, 599, 3999, 2999, 799, 4499][i]),
  currency: "BDT",
  requiresQuotation: false,
  formSchema: {},
  isActive: [true, true, true, false, true, true, true, false, true][i],
  sortOrder: i,
  createdAt: new Date(Date.now() - i * 86400000 * 15).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export function ServicesPage() {
  const { toast } = useToast();
  const { page, limit } = usePagination();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const debouncedSearch = useDebounce(search);
  const {
    data: serviceData,
    isLoading: isGetServiceLoading,
    isFetching: isGetServiceFetching,
    isError,
    error,
    status,
    refetch,
  } = useGetAllServicesQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearch || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
    {
      refetchOnMountOrArgChange: true, // <-- force refetch
    },
  );

  console.log({
    status,
    isGetServiceLoading,
    isGetServiceFetching,
    isError,
    error,
    data: serviceData?.data,
  });

  const { data: serviceCategories, isLoading: isGetServiceCategoryLoading } =
    useGetServiceCategoriesQuery();

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const [toggleStatus] = useToggleServiceStatusMutation();

  console.log({ serviceData, serviceCategories });

  const handleCreate = async (formData: ServiceFormData) => {
    try {
      await createService({
        ...formData,
        price: String(formData.price),
      } as Partial<Service>).unwrap();
      toast({ title: "Service created successfully" });
      setIsFormOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Failed to create service" });
    }
  };

  const handleEdit = async (formData: ServiceFormData) => {
    if (!selectedService) return;
    try {
      await updateService({
        id: selectedService.id,
        body: {
          ...formData,
          price: String(formData.price),
        } as Partial<Service>,
      }).unwrap();
      toast({ title: "Service updated successfully" });
      setSelectedService(null);
      setIsFormOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Failed to update service" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteService(deleteTarget.id).unwrap();
      toast({ title: "Service deleted" });
      setDeleteTarget(null);
    } catch {
      toast({ variant: "destructive", title: "Failed to delete service" });
    }
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      await toggleStatus(service.id).unwrap();
      toast({
        title: `Service ${service.isActive ? "deactivated" : "activated"}`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to toggle service status",
      });
    }
  };

  const allServices = serviceData?.data ?? MOCK_SERVICES;

  const filteredServices = allServices.filter((svc: Service) => {
    const matchesSearch =
      !debouncedSearch ||
      svc.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && svc.isActive) ||
      (statusFilter === "inactive" && !svc.isActive);
    return matchesSearch && matchesStatus;
  });

  // Show loading state
  if (isGetServiceLoading) {
    return (
      <PageWrapper>
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Services"
        description="Manage your service catalog"
        actions={
          <Button
            onClick={() => {
              setSelectedService(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Service
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
          placeholder="Search services..."
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={(svc: Service) => {
              setSelectedService(svc);
              setIsFormOpen(true);
            }}
            onDelete={setDeleteTarget}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>

      <ServiceForm
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedService(null);
          setIsFormOpen(open);
        }}
        onSubmit={selectedService ? handleEdit : handleCreate}
        defaultValues={selectedService ?? undefined}
        isLoading={isCreating || isUpdating}
        mode={selectedService ? "edit" : "create"}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />
    </PageWrapper>
  );
}
