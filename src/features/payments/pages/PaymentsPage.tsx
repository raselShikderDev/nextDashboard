import { useState } from "react";
import { Filter, DollarSign, TrendingUp, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { SearchInput } from "../../../components/SearchInput";
import { PaymentsTable } from "../components/PaymentsTable";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { StatsCard } from "../../dashboard/components/StatsCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  useGetPaymentsQuery,
  useDeletePaymentMutation,
  useRefundPaymentMutation,
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
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [refundTarget, setRefundTarget] = useState<Payment | null>(null);

  const debouncedSearch = useDebounce(search);

  const { data: displayData, isLoading } = useGetPaymentsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  const [refundPayment, { isLoading: isRefunding }] =
    useRefundPaymentMutation();

  const payments = displayData?.data ?? [];

  const totalRevenue = payments.reduce(
    (sum, payment) =>
      payment.status === "VERIFIED" ? sum + Number(payment.amount) : sum,
    0,
  );

  const pendingCount = payments.filter(
    (payment) => payment.status === "SUBMITTED",
  ).length;

  const failedCount = payments.filter(
    (payment) => payment.status === "REJECTED",
  ).length;

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deletePayment(deleteTarget.id).unwrap();

      toast({
        title: "Payment deleted",
      });

      setDeleteTarget(null);
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to delete payment",
      });
    }
  };

  const handleRefund = async () => {
    if (!refundTarget) return;

    try {
      await refundPayment(refundTarget.id).unwrap();

      toast({
        title: "Payment refunded successfully",
      });

      setRefundTarget(null);
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to refund payment",
      });
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Payments"
        description="Track and manage all payment transactions"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Revenue"
          value={totalRevenue}
          icon={DollarSign}
          format="currency"
          color="green"
          index={0}
        />

        <StatsCard
          title="Total Payments"
          value={displayData?.meta?.total ?? 0}
          icon={TrendingUp}
          color="blue"
          index={1}
        />

        <StatsCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          color="orange"
          index={2}
        />

        <StatsCard
          title="Rejected"
          value={failedCount}
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
          placeholder="Search transactions..."
          className="flex-1 max-w-sm"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
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
        onDelete={setDeleteTarget}
        onRefund={setRefundTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Payment"
        description="Are you sure you want to delete this payment record?"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />

      <ConfirmDialog
        open={!!refundTarget}
        onOpenChange={(open) => !open && setRefundTarget(null)}
        title="Refund Payment"
        description={
          refundTarget
            ? `Refund payment of ৳${Number(
                refundTarget.amount,
              ).toLocaleString()}?`
            : ""
        }
        onConfirm={handleRefund}
        isLoading={isRefunding}
        confirmLabel="Refund"
        variant="default"
      />
    </PageWrapper>
  );
}
