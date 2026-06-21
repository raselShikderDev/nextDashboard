import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { SearchInput } from "../../../components/SearchInput";
import { RequestsTable } from "../components/RequestsTable";
import { RequestForm } from "../components/RequestForm";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useGetRequestsQuery, useCreateRequestMutation, useUpdateRequestMutation, useDeleteRequestMutation, useApproveRequestMutation, useRejectRequestMutation } from "../api/requestsApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePagination } from "../../../hooks/usePagination";
import { useToast } from "../../../hooks/useToast";
import type { Request } from "../../../types";
import type { RequestFormData } from "../../../lib/validators";

const NAMES = ["Alice Johnson","Bob Smith","Carol White","David Lee","Eva Martinez","Frank Brown","Grace Kim","Henry Davis","Isla Wilson","Jack Moore"];
const MOCK_DATA = {
  data: Array.from({ length: 10 }, (_, i) => ({
    id: `req-${i}`, title: `Service Request #${1001 + i}`, description: "Request description",
    status: (["pending","approved","in_progress","completed","rejected"] as const)[i % 5],
    priority: (["low","medium","high","urgent"] as const)[i % 4],
    userId: `user-${i}`,
    user: { id: `user-${i}`, name: NAMES[i], email: `user${i}@example.com`, role: "user" as const, createdAt: "", updatedAt: "", isActive: true },
    serviceId: `svc-${i % 5}`,
    service: { id: `svc-${i % 5}`, name: ["Web Dev","Design","Analytics","Hosting","Support"][i % 5], description: "", price: 0, category: "", status: "active" as const, createdAt: "", updatedAt: "" },
    amount: (i + 1) * 350, createdAt: new Date(Date.now() - i * 86400000).toISOString(), updatedAt: new Date().toISOString(),
  })),
  total: 48, page: 1, limit: 10, totalPages: 5,
};

export function RequestsPage() {
  const { toast } = useToast();
  const { page, limit, goToPage, changeLimit } = usePagination();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Request | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Request | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useGetRequestsQuery({ page, limit, search: debouncedSearch || undefined, status: statusFilter !== "all" ? statusFilter : undefined });
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] = useUpdateRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();
  const [approveRequest] = useApproveRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();

  const handleCreate = async (formData: RequestFormData) => {
    try { await createRequest(formData).unwrap(); toast({ title: "Request created successfully" }); setIsFormOpen(false); }
    catch { toast({ variant: "destructive", title: "Failed to create request" }); }
  };
  const handleEdit = async (formData: RequestFormData) => {
    if (!selectedRequest) return;
    try { await updateRequest({ id: selectedRequest.id, body: formData }).unwrap(); toast({ title: "Request updated successfully" }); setSelectedRequest(null); setIsFormOpen(false); }
    catch { toast({ variant: "destructive", title: "Failed to update request" }); }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteRequest(deleteTarget.id).unwrap(); toast({ title: "Request deleted" }); setDeleteTarget(null); }
    catch { toast({ variant: "destructive", title: "Failed to delete request" }); }
  };
  const handleApprove = async (request: Request) => {
    try { await approveRequest(request.id).unwrap(); toast({ title: "Request approved" }); }
    catch { toast({ variant: "destructive", title: "Failed to approve request" }); }
  };
  const handleReject = async () => {
    if (!rejectTarget) return;
    try { await rejectRequest({ id: rejectTarget.id }).unwrap(); toast({ title: "Request rejected" }); setRejectTarget(null); }
    catch { toast({ variant: "destructive", title: "Failed to reject request" }); }
  };

  const displayData = data ?? MOCK_DATA;

  return (
    <PageWrapper>
      <PageHeader title="Requests" description="Manage and track all service requests"
        actions={<Button onClick={() => { setSelectedRequest(null); setIsFormOpen(true); }}><Plus className="w-4 h-4 mr-2" />New Request</Button>}
      />
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search requests..." className="flex-1 max-w-sm" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      <RequestsTable data={displayData.data} total={displayData.total} page={page} limit={limit} isLoading={isLoading} onPageChange={goToPage} onLimitChange={changeLimit}
        onEdit={(req) => { setSelectedRequest(req); setIsFormOpen(true); }} onDelete={setDeleteTarget} onApprove={handleApprove} onReject={setRejectTarget}
      />
      <RequestForm open={isFormOpen} onOpenChange={(open) => { if (!open) setSelectedRequest(null); setIsFormOpen(open); }}
        onSubmit={selectedRequest ? handleEdit : handleCreate} defaultValues={selectedRequest ?? undefined}
        isLoading={isCreating || isUpdating} mode={selectedRequest ? "edit" : "create"}
      />
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Request" description={`Are you sure you want to delete "${deleteTarget?.title}"?`} onConfirm={handleDelete} isLoading={isDeleting} confirmLabel="Delete" />
      <ConfirmDialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)} title="Reject Request" description={`Are you sure you want to reject "${rejectTarget?.title}"?`} onConfirm={handleReject} isLoading={isRejecting} confirmLabel="Reject" />
    </PageWrapper>
  );
}
