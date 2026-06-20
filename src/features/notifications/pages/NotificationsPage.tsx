import { useState } from "react";
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  addNotification,
} from "../slice/notificationsSlice";
import type { Notification } from "../../../types";
import { cn } from "@/lib/utils";
import { formatRelativeTime, generateId } from "@/app/helpers/helpers";

const typeConfig = {
  info: {
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  success: {
    dot: "bg-green-500",
    badge:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  warning: {
    dot: "bg-yellow-500",
    badge:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  error: {
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: generateId(),
    title: "New Request Submitted",
    message:
      "Alice Johnson submitted a new Web Development request for $2,499.",
    type: "info",
    isRead: false,
    userId: "user-1",
    link: "/requests",
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: generateId(),
    title: "Payment Received",
    message: "Payment of $1,499 for UI/UX Design service has been received.",
    type: "success",
    isRead: false,
    userId: "user-2",
    link: "/payments",
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: generateId(),
    title: "Request Rejected",
    message:
      "Your cloud hosting request has been rejected due to missing documentation.",
    type: "error",
    isRead: true,
    userId: "user-3",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: generateId(),
    title: "System Maintenance",
    message: "Scheduled maintenance on Sunday from 2 AM to 4 AM UTC.",
    type: "warning",
    isRead: false,
    userId: "user-0",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: generateId(),
    title: "New User Registered",
    message:
      "Frank Brown has registered a new account and is awaiting activation.",
    type: "info",
    isRead: true,
    userId: "user-5",
    link: "/users",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: generateId(),
    title: "Payment Failed",
    message:
      "Payment for request #REQ-1045 has failed. Please verify payment details.",
    type: "error",
    isRead: false,
    userId: "user-6",
    link: "/payments",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function NotificationsPage() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((s) => s.notifications.items);
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [seeded, setSeeded] = useState(false);

  if (!seeded && notifications.length === 0) {
    DEMO_NOTIFICATIONS.forEach((n) => dispatch(addNotification(n)));
    setSeeded(true);
  }

  const filtered = notifications.filter((n) => {
    const matchesType = typeFilter === "all" || n.type === typeFilter;
    const matchesRead =
      readFilter === "all" ||
      (readFilter === "unread" && !n.isRead) ||
      (readFilter === "read" && n.isRead);
    return matchesType && matchesRead;
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Notifications"
        description="Stay updated with system alerts and activity"
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              onClick={() => dispatch(markAllAsRead())}
              className="gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          ) : undefined
        }
      />
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 mb-5"
      >
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="self-center">
            {unreadCount} unread
          </Badge>
        )}
      </motion.div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="font-semibold">No notifications</p>
          <p className="text-sm text-muted-foreground">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={cn(
                  "flex gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-all cursor-pointer group",
                  !notification.isRead && "border-primary/20 bg-primary/5",
                )}
                onClick={() => dispatch(markAsRead(notification.id))}
              >
                <div className="shrink-0 pt-1">
                  <span
                    className={cn(
                      "block w-2.5 h-2.5 rounded-full",
                      typeConfig[notification.type].dot,
                      notification.isRead && "opacity-30",
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={cn(
                          "text-sm",
                          !notification.isRead
                            ? "font-semibold"
                            : "font-medium",
                        )}
                      >
                        {notification.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize",
                          typeConfig[notification.type].badge,
                        )}
                      >
                        {notification.type}
                      </Badge>
                      {!notification.isRead && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeNotification(notification.id));
                  }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </PageWrapper>
  );
}
