import { Badge } from "../../../components/ui/badge";
import type { PaymentStatus } from "../../../types";
import { cn } from "../../../lib/utils";

interface PaymentStatusBadgeProps { status: PaymentStatus; className?: string; }

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200" },
  paid: { label: "Paid", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200" },
  failed: { label: "Failed", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200" },
  refunded: { label: "Refunded", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200" },
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant="outline" className={cn("font-medium", config.className, className)}>{config.label}</Badge>;
}
