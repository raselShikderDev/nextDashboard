import { RequestStatus } from "@/types/enums.types";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";

interface RequestStatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const statusConfig: Record<
  RequestStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400",
  },

  PENDING: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  },

  SUBMITTED: {
    label: "Submitted",
    className:
      "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400",
  },

  UNDER_REVIEW: {
    label: "Under Review",
    className:
      "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400",
  },

  PAYMENT_PENDING: {
    label: "Payment Pending",
    className:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  },

  PAYMENT_SUBMITTED: {
    label: "Payment Submitted",
    className:
      "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400",
  },

  PAYMENT_VERIFIED: {
    label: "Payment Verified",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  },

  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  },

  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-400",
  },

  APPROVED: {
    label: "Approved",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  },

  READY_FOR_DELIVERY: {
    label: "Ready For Delivery",
    className:
      "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400",
  },

  DELIVERED: {
    label: "Delivered",
    className:
      "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400",
  },
};

export function RequestStatusBadge({
  status,
  className,
}: RequestStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}