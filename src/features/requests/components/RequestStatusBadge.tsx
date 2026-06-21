import { Badge } from "../../../components/ui/badge";
import type { RequestStatus } from "../../../types";
import { cn } from "../../../lib/utils";

interface RequestStatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const statusConfig: Record<
  RequestStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200",
  },
  approved: {
    label: "Approved",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200",
  },
  in_progress: {
    label: "In Progress",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
  },
  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200",
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
      className={cn("font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
