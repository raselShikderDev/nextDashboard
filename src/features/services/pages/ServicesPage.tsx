import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { SearchInput } from "../../../components/SearchInput";
import { ServicesGrid } from "../components/ServicesGrid";
import { ServiceForm } from "../components/ServiceForm";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useGetServicesQuery, useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation, useToggleServiceStatusMutation } from "../api/servicesApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { useToast } from "../../../hooks/useToast";
import type { Service } from "../../../types";
import type { ServiceFormData } from "../../../lib/validators";

const MOCK_SERVICES: Service[] = Array.from({ length: 9 }, (_, i) => ({
  id: `svc-${i}`,
  name: ["Web Development","UI/UX Design","Data Analytics","Cloud Hosting","IT Support","Cybersecurity","Mobile Development","SEO Optimization","DevOps Consulting"][i],
  description: "Professional service offering with enterprise-grade quality and 24/7 support included.",
  price: [2499,1499,1999,299,599,3999,2999,799,4499][i],
  category: ["Development","Design","Analytics","Infrastructure","Support","Security","Development","Marketing","Consulting"][i],
  status: (["active","active","active","inactive","active","active","active","deprecated","active"] as const)[i],
  icon: ["💻","🎨","📊","☁️","🛠️","🔒","📱","🔍","⚙️"][i],
  createdAt: new Date(Date.now() - i * 86400000 * 15).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export function ServicesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useGetServicesQuery({ search: debouncedSearch || undefined, status: statusFilter !== "all" ? statusFilter : undefined });
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const [toggleStatus] = useToggleServiceStatusMutation();

  const handleCreate = async (formData: ServiceFormData) => {
    try { await createService(formData).unwrap(); toast({ title: "Service created successfully" }); setIsFormOpen(false); }
    catch { toast({ variant: "destructive", title: "Failed to create service" }); }
  };
  const handleEdit = async (formData: ServiceFormData) => {
    if (!selectedService) return;
    try { await updateService({ id: selectedService.id, body: formData }).unwrap(); toast({ title: "Service updated successfully" }); setSelectedService(null); setIsFormOpen(false); }
    catch { toast({ variant: "destructive", title: "Failed to update service" }); }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteService(deleteTarget.id).unwrap(); toast({ title: "Service deleted" }); setDeleteTarget(null); }
    catch { toast({ variant: "destructive", title: "Failed to delete service" }); }
  };
  const handleToggleStatus = async (service: Service) => {
    try { await toggleStatus(service.id).unwrap(); toast({ title: `Service ${service.status === "active" ? "deactivated" : "activated"}` }); }
    catch { toast({ variant: "destructive", title: "Failed to toggle service status" }); }
  };

  const allServices = data?.data ?? MOCK_SERVICES;
  const filteredServices = allServices.filter((svc) => {
    const matchesSearch = !debouncedSearch || svc.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || svc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageWrapper>
      <PageHeader title="Services" description="Manage your service catalog"
        actions={<Button onClick={() => { setSelectedService(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 mr-2" />New Service</Button>}
      />
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search services..." className="flex-1 max-w-sm" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="deprecated">Deprecated</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      <ServicesGrid data={filteredServices} isLoading={isLoading} onEdit={(svc) => { setSelectedService(svc); setIsFormOpen(true); }} onDelete={setDeleteTarget} onToggleStatus={handleToggleStatus} />
      <ServiceForm open={isFormOpen} onOpenChange={(open) => { if (!open) setSelectedService(null); setIsFormOpen(open); }}
        onSubmit={selectedService ? handleEdit : handleCreate} defaultValues={selectedService ?? undefined}
        isLoading={isCreating || isUpdating} mode={selectedService ? "edit" : "create"}
      />
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Service" description={`Are you sure you want to delete "${deleteTarget?.name}"?`} onConfirm={handleDelete} isLoading={isDeleting} confirmLabel="Delete" />
    </PageWrapper>
  );
}
