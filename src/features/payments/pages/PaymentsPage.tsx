import { useState } from "react";
import { Filter, DollarSign, TrendingUp, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { SearchInput } from "../../../components/SearchInput";
import { PaymentsTable } from "../components/PaymentsTable";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { StatsCard } from "../../dashboard/components/StatsCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useGetPaymentsQuery, useDeletePaymentMutation, useRefundPaymentMutation } from "../api/paymentsApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePagination } from "../../../hooks/usePagination";
import { useToast } from "../../../hooks/useToast";
import type { Payment } from "../../../types";

const NAMES = ["Alice Johnson","Bob Smith","Carol White","David Lee","Eva Martinez","Frank Brown","Grace Kim","Henry Davis","Isla Wilson","Jack Moore"];
const MOCK_PAYMENTS: Payment[] = Array.from({ length: 10 }, (_, i) => ({
  id: `pay-${i}`, requestId: `req-${i}`, userId: `user-${i}`,
  user: { id: `user-${i}`, name: NAMES[i], email: `user${i}@example.com`, role: "user" as const, createdAt: "", updatedAt: "", isActive: true },
  amount: (i + 1) * 499.99,
  status: (["pending","paid","paid","failed","refunded"] as const)[i % 5],
  method: (["credit_card","bank_transfer","online","cash"] as const)[i % 4],
  transactionId: `TXN${100000 + i}`,
  paidAt: i % 4 !== 2 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export function PaymentsPage() {
  const { toast } = useToast();
  const { page, limit, goToPage, changeLimit } = usePagination();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [refundTarget, setRefundTarget] = useState<Payment | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useGetPaymentsQuery({ page, limit, search: debouncedSearch || undefined, status: statusFilter !== "all" ? statusFilter : undefined });
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();
  const [refundPayment, { isLoading: isRefunding }] = useRefundPaymentMutation();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await deletePayment(deleteTarget.id).unwrap(); toast({ title: "Payment deleted" }); setDeleteTarget(null); }
    catch { toast({ variant: "destructive", title: "Failed to delete payment" }); }
  };
  const handleRefund = async () => {
    if (!refundTarget) return;
    try { await refundPayment(refundTarget.id).unwrap(); toast({ title: "Payment refunded successfully" }); setRefundTarget(null); }
    catch { toast({ variant: "destructive", title: "Failed to refund payment" }); }
  };

  const displayData = data ?? { data: MOCK_PAYMENTS, total: 48, page: 1, limit: 10, totalPages: 5 };
  const totalRevenue = displayData.data.reduce((s, p) => p.status === "paid" ? s + p.amount : s, 0);
  const pendingCount = displayData.data.filter((p) => p.status === "pending").length;
  const failedCount = displayData.data.filter((p) => p.status === "failed").length;

  return (
    <PageWrapper>
      <PageHeader title="Payments" description="Track and manage all payment transactions" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Revenue" value={totalRevenue} icon={DollarSign} format="currency" color="green" index={0} />
        <StatsCard title="Total Payments" value={displayData.total} icon={TrendingUp} color="blue" index={1} />
        <StatsCard title="Pending" value={pendingCount} icon={Clock} color="orange" index={2} />
        <StatsCard title="Failed" value={failedCount} icon={XCircle} color="red" index={3} />
      </div>
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search transactions..." className="flex-1 max-w-sm" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      <PaymentsTable data={displayData.data} total={displayData.total} page={page} limit={limit} isLoading={isLoading} onPageChange={goToPage} onLimitChange={changeLimit} onDelete={setDeleteTarget} onRefund={setRefundTarget} />
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Payment" description="Are you sure you want to delete this payment record?" onConfirm={handleDelete} isLoading={isDeleting} confirmLabel="Delete" />
      <ConfirmDialog open={!!refundTarget} onOpenChange={(open) => !open && setRefundTarget(null)} title="Refund Payment" description={`Refund payment of ${refundTarget ? `$${refundTarget.amount.toFixed(2)}` : ""}?`} onConfirm={handleRefund} isLoading={isRefunding} confirmLabel="Refund" variant="default" />
    </PageWrapper>
  );
}
