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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  useGetRequestsQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
  useApproveRequestMutation,
  useCancelRequestMutation,
  useStratWorkRequestMutation,
} from "../api/requestsApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePagination } from "../../../hooks/usePagination";
import type { RequestFormData } from "../../../lib/validators";
import { ServiceRequest } from "@/types/request.types";
import { RequestStatus } from "@/types/enums";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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

const SERVICES = [
  "APS Certificate",
  "Germany SOP Writing",
  "Blocked Account",
  "Student Visa",
  "Accommodation",
];

export const MOCK_REQUESTS = Array.from({ length: 10 }, (_, i) => ({
  id: `req-${i}`,
  requestNo: `NSX-2026-${String(i + 1).padStart(6, "0")}`,
  userId: null,
  user: null,
  serviceId: `service-${i % 5}`,
  assignedToId: i % 3 === 0 ? `admin-${i}` : null,
  isGuest: true,
  guestName: NAMES[i],
  guestEmail: `user${i}@example.com`,
  guestPhone: `0170000000${i}`,
  guestAddress: "Dhaka",
  guestSource: (["FACEBOOK", "REFERRAL", "WEBSITE"] as const)[i % 3],
  status: (
    [
      "SUBMITTED",
      "PAYMENT_PENDING",
      "PAYMENT_VERIFIED",
      "IN_PROGRESS",
      "COMPLETED",
    ] as const
  )[i % 5],
  formData: {
    passportNumber: `P${100000 + i}`,
  },
  userNotes: "Need urgent processing",
  adminNotes: null,
  quotedPrice: null,
  finalPrice: null,
  currency: "BDT",
  deliveryMessage: null,
  submittedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  dueDate: null,
  completedAt: null,
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  service: {
    id: `service-${i % 5}`,
    name: SERVICES[i % 5],
    price: String((i + 1) * 5000),
    requiresQuotation: false,
  },
  assignedTo:
    i % 3 === 0
      ? {
          id: `admin-${i}`,
          name: "Super Admin",
        }
      : null,
  payment:
    i % 2 === 0
      ? {
          id: `payment-${i}`,
          status: "VERIFIED",
          amount: String((i + 1) * 5000),
          method: "BKASH",
        }
      : null,
}));

export const MOCK_DATA = {
  data: MOCK_REQUESTS,
  meta: {
    total: 48,
    page: 1,
    limit: 10,
    totalPage: 5,
    hasNextPage: true,
    hasPreviousPage: false,
  },
};

export const REQUEST_STATUS_OPTIONS = [
  { value: RequestStatus.DRAFT, label: "Draft" },
  { value: RequestStatus.SUBMITTED, label: "Submitted" },
  { value: RequestStatus.UNDER_REVIEW, label: "Under Review" },
  { value: RequestStatus.PAYMENT_PENDING, label: "Payment Pending" },
  { value: RequestStatus.PAYMENT_SUBMITTED, label: "Payment Submitted" },
  { value: RequestStatus.PAYMENT_VERIFIED, label: "Payment Verified" },
  { value: RequestStatus.IN_PROGRESS, label: "In Progress" },
  { value: RequestStatus.READY_FOR_DELIVERY, label: "Ready For Delivery" },
  { value: RequestStatus.DELIVERED, label: "Delivered" },
  { value: RequestStatus.COMPLETED, label: "Completed" },
  { value: RequestStatus.REJECTED, label: "Rejected" },
  { value: RequestStatus.CANCELLED, label: "Cancelled" },
];

export function RequestsPage() {
  const { page, limit, goToPage, changeLimit } = usePagination();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<ServiceRequest | null>(null);
  const [startWorkTarget, setStartWorkTarget] = useState<ServiceRequest | null>(
    null,
  );
  const [rejectTarget, setRejectTarget] = useState<ServiceRequest | null>(null);
  const debouncedSearch = useDebounce(search);
  const {
    data,
    isLoading: isGetRequestLoading,
    isFetching: isGetRequestFetching,
  } = useGetRequestsQuery({
    page,
    limit,
    searchTerm: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] = useUpdateRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();
  const [startWork, { isLoading: isStartingWork }] =
    useStratWorkRequestMutation();
  const [approveRequest] = useApproveRequestMutation();
  const [cancelRequest, { isLoading: isRejecting }] =
    useCancelRequestMutation();

  const handleCreate = async (formData: RequestFormData) => {
    try {
      await createRequest(formData).unwrap();
      // toast({ title: "Request created successfully" });
      setIsFormOpen(false);
    } catch {
      // toast({ variant: "destructive", title: "Failed to create request" });
    }
  };

  const handleEdit = async (formData: RequestFormData) => {
    if (!selectedRequest) return;
    try {
      await updateRequest({ id: selectedRequest?.id, body: formData }).unwrap();
      // toast({ title: "Request updated successfully" });

      setSelectedRequest(null);
      setIsFormOpen(false);
    } catch {
      // toast({ variant: "destructive", title: "Failed to update request" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRequest(deleteTarget.id).unwrap();
      // toast({ title: "Request deleted" });
      setDeleteTarget(null);
    } catch {
      // toast({ variant: "destructive", title: "Failed to delete request" });
    }
  };
  const handleStartWork = async () => {
    if (!startWorkTarget) return;
    try {
      await startWork(startWorkTarget.id).unwrap();
      // toast({ title: "Request deleted" });
      setStartWorkTarget(null);
    } catch {
      // toast({ variant: "destructive", title: "Failed to delete request" });
    }
  };

  const handleApprove = async (request: ServiceRequest) => {
    try {
      await approveRequest(request.id).unwrap();
      // toast({ title: "Request approved" });
    } catch {
      // toast({ variant: "destructive", title: "Failed to approve request" });
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    try {
      await cancelRequest({ id: rejectTarget.id }).unwrap();
      // toast({ title: "Request rejected" });
      setRejectTarget(null);
    } catch {
      // toast({ variant: "destructive", title: "Failed to reject request" });
    }
  };

  const displayData = data ?? MOCK_DATA;
  const showLoader = isGetRequestLoading || isGetRequestFetching;

  return (
    <PageWrapper>
      <PageHeader
        title="Requests"
        description="Manage and track all service requests"
        actions={
          <Button
            onClick={() => {
              setSelectedRequest(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
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
          placeholder="Search requests..."
          className="flex-1 max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="hover:cursor-pointer" value="All">
              All Status
            </SelectItem>
            {REQUEST_STATUS_OPTIONS.map((status) => (
              <SelectItem
                className="hover:cursor-pointer"
                key={status.value}
                value={status.value}
              >
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>
      {showLoader ? (
        <LoadingSpinner />
      ) : (
        <RequestsTable
          data={displayData?.data as ServiceRequest[]}
          total={displayData?.meta?.total ?? 0}
          page={page}
          limit={limit}
          isLoading={false}
          onPageChange={goToPage}
          onLimitChange={changeLimit}
          onApprove={handleApprove}
          onStartWork={handleStartWork}
          onReject={setRejectTarget}
        />
      )}
      <RequestForm
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
          setIsFormOpen(open);
        }}
        onSubmit={selectedRequest ? handleEdit : handleCreate}
        defaultValues={selectedRequest ?? undefined}
        isLoading={isCreating || isUpdating}
        mode={selectedRequest ? "edit" : "create"}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Request"
        description={`Are you sure you want to delete "${deleteTarget?.service?.name}"?`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />
      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Reject Request"
        description={`Are you sure you want to reject "${rejectTarget?.service?.name}"?`}
        onConfirm={handleReject}
        isLoading={isRejecting}
        confirmLabel="Reject"
      />
    </PageWrapper>
  );
}
