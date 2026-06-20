import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import type { Request } from "../../../types";
import { cn } from "../../../lib/utils";
import {
  formatCurrency,
  formatRelativeTime,
  getInitials,
} from "@/app/helpers/helpers";

interface RecentRequestsProps {
  requests: Request[];
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">Recent Requests</h3>
          <p className="text-sm text-muted-foreground">
            Latest service requests
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-primary"
          onClick={() => navigate("/requests")}
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="space-y-1">
        {requests.slice(0, 6).map((request, i) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => navigate(`/requests`)}
          >
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {request.user
                  ? getInitials(request.user?.userDetails.name)
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{request.title}</p>
              <p className="text-xs text-muted-foreground">
                {request.user?.userDetails.name ?? "Unknown"} ·{" "}
                {formatRelativeTime(request.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs capitalize",
                  statusStyles[request.status],
                )}
              >
                {request.status.replace("_", " ")}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(request.amount)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
