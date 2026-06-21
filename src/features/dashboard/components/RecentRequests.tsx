import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { cn } from "../../../lib/utils";
import {
  formatCurrency,
  formatRelativeTime,
  formatRole,
  getInitials,
} from "@/app/helpers/helpers";
import { ServiceRequest } from "@/types/request.types";

interface RecentRequestsProps {
  requests: ServiceRequest[];
  isLoading?: boolean;
}

const statusStyles: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  in_progress:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export function RecentRequests({ requests, isLoading }: RecentRequestsProps) {
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 animate-pulse">
        <div className="h-5 w-40 bg-muted rounded mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 py-3">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Recent Requests
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest service activities
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl"
          onClick={() => navigate("/requests")}
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      {/* Request Card */}
      {requests.map((request: ServiceRequest, i) => {
        return (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/requests/${request.id}`)}
            className="group rounded-2xl border border-border bg-background/50 p-4 transition-all hover:border-primary/30 hover:bg-muted/30 hover:shadow-sm cursor-pointer"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(request.guestName || "Guest")}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium truncate">{request.guestName}</p>

                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {request.requestNo}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground truncate">
                    {request.service.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(request.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:min-w-[120px]">
                <Badge
                  className={cn(
                    "rounded-full border-0 text-xs",
                    statusStyles[request.status],
                  )}
                >
                  {formatRole(request.status)}
                </Badge>

                <span className="text-sm font-semibold whitespace-nowrap">
                  {formatCurrency(
                    Number(
                      request.finalPrice ??
                        request.payment?.amount ??
                        request.service.price,
                    ),
                  )}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
