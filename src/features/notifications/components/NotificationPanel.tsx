import { motion } from "framer-motion";
import { X, Bell, CheckCheck, Trash2, ExternalLink } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
} from "../slice/notificationsSlice";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../../../types";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/app/helpers/helpers";

const typeStyles: Record<Notification["type"], string> = {
  info: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notifications = useAppSelector((s) => s.notifications.items);
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);

  const handleClick = (notification: Notification) => {
    dispatch(markAsRead(notification.id));
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="absolute right-0 top-0 h-full w-80 bg-card border-l border-border shadow-2xl z-20 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h2 className="font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => dispatch(markAllAsRead())}
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <Bell className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "group flex gap-3 px-4 py-3 cursor-pointer transition-colors",
                  !notification.isRead && "bg-primary/5",
                  "hover:bg-muted/50",
                )}
                onClick={() => handleClick(notification)}
              >
                <div className="shrink-0 mt-1">
                  <span
                    className={cn(
                      "block w-2 h-2 rounded-full",
                      typeStyles[notification.type],
                      notification.isRead && "opacity-30",
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm leading-tight",
                        !notification.isRead ? "font-semibold" : "font-medium",
                      )}
                    >
                      {notification.title}
                    </p>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {notification.link && (
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(removeNotification(notification.id));
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="border-t border-border p-3 shrink-0">
        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={() => {
            navigate("/notifications");
            onClose();
          }}
        >
          View all notifications
        </Button>
      </div>
    </motion.div>
  );
}
