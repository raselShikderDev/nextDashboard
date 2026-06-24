import { PaymentStatus } from "@/types/enums.types";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  SUBMITTED: {
    label: "Submitted",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  },

  VERIFIED: {
    label: "Verified",
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  },

  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  },

  REFUNDED: {
    label: "Refunded",
    className:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  },
};

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium rounded-full",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}