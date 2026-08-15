import { useState } from "react";
import { Filter, DollarSign, TrendingUp, Clock, XCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { SearchInput } from "../../../components/SearchInput";
import { PaymentsTable } from "../components/PaymentsTable";
import { PaymentViewCard } from "../components/PaymentViewCard";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { StatsCard } from "../../dashboard/components/StatsCard";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  useGetPaymentsQuery,
  useGetPaymentAnalyticsQuery,
  useVerifyPaymentMutation,
  useRejectPaymentMutation,
  useDeletePaymentMutation,
} from "../api/paymentsApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePagination } from "../../../hooks/usePagination";
import { useToast } from "../../../hooks/useToast";
import { Payment } from "@/types/payment.types";

export function PaymentsPage() {
  const { toast } = useToast();
  const { page, limit, goToPage, changeLimit } = usePagination();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const [viewTarget, setViewTarget] = useState<Payment | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<Payment | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Payment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);

  const [adminNote, setAdminNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const debouncedSearch = useDebounce(search);

  const { data: displayData, isLoading } = useGetPaymentsQuery({
    page,
    limit,
    searchTerm: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: analytics } = useGetPaymentAnalyticsQuery();

  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const [rejectPayment, { isLoading: isRejecting }] = useRejectPaymentMutation();
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  const payments = displayData?.data ?? [];

  const handleVerify = async () => {
    if (!verifyTarget) return;
    try {
      await verifyPayment({
        id: verifyTarget.id,
        adminNote: adminNote || undefined,
      }).unwrap();

      toast({ title: "Payment verified successfully" });
      setVerifyTarget(null);
      setAdminNote("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: err?.data?.message || "Could not verify payment",
      });
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectionReason.trim()) {
      toast({ variant: "destructive", title: "Rejection reason is required" });
      return;
    }
    try {
      await rejectPayment({
        id: rejectTarget.id,
        rejectionReason: rejectionReason.trim(),
        adminNote: adminNote || undefined,
      }).unwrap();

      toast({ title: "Payment rejected" });
      setRejectTarget(null);
      setRejectionReason("");
      setAdminNote("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Rejection failed",
        description: err?.data?.message || "Could not reject payment",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePayment(deleteTarget.id).unwrap();
      toast({ title: "Payment record deleted" });
      setDeleteTarget(null);
    } catch {
      toast({ variant: "destructive", title: "Failed to delete payment" });
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Payments"
        description="Track, verify, and manage all payment transactions"
      />

      {/* Stats from real analytics API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Revenue"
          value={analytics?.verifiedRevenue ?? 0}
          icon={DollarSign}
          format="currency"
          color="green"
          index={0}
        />
        <StatsCard
          title="Total Payments"
          value={analytics?.totalPayments ?? 0}
          icon={TrendingUp}
          color="blue"
          index={1}
        />
        <StatsCard
          title="Pending Verification"
          value={analytics?.pendingPayments ?? 0}
          icon={Clock}
          color="orange"
          index={2}
        />
        <StatsCard
          title="Rejected"
          value={analytics?.rejectedPayments ?? 0}
          icon={XCircle}
          color="red"
          index={3}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3 mb-5"
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Trx ID or sender..."
          className="flex-1 max-w-sm"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 cursor-pointer">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="all">
              All Status
            </SelectItem>
            <SelectItem className="cursor-pointer" value="SUBMITTED">
              Submitted
            </SelectItem>
            <SelectItem className="cursor-pointer" value="VERIFIED">
              Verified
            </SelectItem>
            <SelectItem className="cursor-pointer" value="REJECTED">
              Rejected
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-40 cursor-pointer">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          {/* <SelectContent>
            <SelectItem className="cursor-pointer" value="all">
              All Methods
            </SelectItem>
            <SelectItem className="cursor-pointer" value="BKASH">
              bKash
            </SelectItem>
            <SelectItem className="cursor-pointer" value="NAGAD">
              Nagad
            </SelectItem>
            <SelectItem className="cursor-pointer" value="BANK_TRANSFER">
              Bank Transfer
            </SelectItem>
            <SelectItem className="cursor-pointer" value="CASH">
              Cash
            </SelectItem>
          </SelectContent> */}
        </Select>
      </motion.div>

      <PaymentsTable
        data={payments}
        total={displayData?.meta?.total ?? 0}
        page={page}
        limit={limit}
        isLoading={isLoading}
        onPageChange={goToPage}
        onLimitChange={changeLimit}
        onView={setViewTarget}
        onVerify={setVerifyTarget}
        onReject={setRejectTarget}
        onDelete={setDeleteTarget}
      />

      {/* View Modal */}
      <PaymentViewCard
        payment={viewTarget}
        open={!!viewTarget}
        onOpenChange={(open) => !open && setViewTarget(null)}
      />

      {/* Verify Modal */}
      <ConfirmDialog
        open={!!verifyTarget}
        onOpenChange={(open) => {
          if (!open) {
            setVerifyTarget(null);
            setAdminNote("");
          }
        }}
        title="Verify Payment"
        description={
          verifyTarget
            ? `Verify payment of ৳${Number(verifyTarget.amount).toLocaleString()} for request ${verifyTarget.request?.requestNo}?`
            : ""
        }
        customContent={
          <div className="space-y-3 mt-2">
            <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Method:</span>{" "}
                {verifyTarget?.method}
              </p>
              <p>
                <span className="text-muted-foreground">Trx ID:</span>{" "}
                {verifyTarget?.transactionId}
              </p>
              <p>
                <span className="text-muted-foreground">Sender:</span>{" "}
                {verifyTarget?.senderNumber || "—"}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Admin Note (optional)</Label>
              <Textarea
                rows={2}
                placeholder="Add an internal note..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
          </div>
        }
        onConfirm={handleVerify}
        isLoading={isVerifying}
        confirmLabel="Verify Payment"
      />

      {/* Reject Modal */}
      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectionReason("");
            setAdminNote("");
          }
        }}
        title="Reject Payment"
        description="Please provide a reason for rejection. The request status will return to Payment Pending."
        customContent={
          <div className="space-y-3 mt-2">
            <div className="space-y-2">
              <Label>
                Rejection Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={3}
                placeholder="e.g. Transaction ID not found, amount mismatch..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Admin Note (optional)</Label>
              <Textarea
                rows={2}
                placeholder="Internal note..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
          </div>
        }
        onConfirm={handleReject}
        isLoading={isRejecting}
        confirmLabel="Reject Payment"
        variant="destructive"
      />

      {/* Delete Modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Payment Record"
        description="Are you sure? This will remove the payment proof and transaction record permanently."
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
        variant="destructive"
      />
    </PageWrapper>
  );
}