import { cn } from "@/lib/utils";
import { ServiceRequest } from "@/types/request.types";
import { CreditCard } from "lucide-react";

interface PaymentBadgeProps {
  payment: ServiceRequest["payment"];
}

export function PaymentBadge({ payment }: PaymentBadgeProps) {
  if (!payment) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
        Unpaid
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        payment.status === "VERIFIED"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"
          : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400"
      )}
    >
      <CreditCard className="h-3 w-3" />
      {payment.status === "VERIFIED" ? "Paid" : "Pending"} · {payment.method}
    </span>
  );
}