import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/slice/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { usePermission } from "@/hooks/usePermission";

const isPathActive = (pathname: string, to?: string) =>
  !!to && (pathname === to || pathname.startsWith(`${to}/`));

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { visibleNavItems } = usePermission();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative flex flex-col h-screen bg-card border-r border-border shrink-0 z-30 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="font-bold text-lg whitespace-nowrap"
              >
                AdminPro
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const children = item.children;

            if (children?.length) {
              const childActive = children.some((c) =>
                isPathActive(location.pathname, c.path)
              );
              const isOpen = openGroups[item.label] ?? childActive;

              // Collapsed: popover
              if (collapsed) {
                return (
                  <Popover key={item.path}>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "flex w-full items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
                          childActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" sideOffset={12} className="w-48 p-1.5">
                      <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      {children.map((child) => {
                        const ChildIcon = child.icon;
                        const active = isPathActive(location.pathname, child.path);
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={cn(
                              "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors cursor-pointer",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <ChildIcon className="w-4 h-4 shrink-0" />
                            {child.label}
                          </NavLink>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                );
              }

              // Expanded: accordion
              return (
                <div key={item.path}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
                      childActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-90"
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="ml-[1.65rem] mt-1 space-y-1 border-l border-border pl-3">
                          {children.map((child) => {
                            const ChildIcon = child.icon;
                            const active = isPathActive(location.pathname, child.path);
                            return (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={cn(
                                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
                                  active
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                              >
                                <ChildIcon className="w-4 h-4 shrink-0" />
                                <span className="whitespace-nowrap">{child.label}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Flat item
            const isActive = isPathActive(location.pathname, item.path);
            const showBadge = item.label === "Notifications" && unreadCount > 0;
            const content = (
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {showBadge && (
                  <span
                    className={cn(
                      "absolute flex items-center justify-center text-xs font-bold rounded-full bg-destructive text-destructive-foreground",
                      collapsed ? "top-1 right-1 w-4 h-4 text-[10px]" : "ml-auto w-5 h-5"
                    )}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </NavLink>
            );

            return collapsed ? (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.path}>{content}</div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-border p-3 space-y-2">
          <div className={cn("flex items-center gap-3 px-2 py-2 rounded-lg", collapsed && "justify-center")}>
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src={user?.userDetails?.avatarUrl || ""} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {user?.userDetails?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.userDetails?.name || user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize truncate">{user?.role?.toLowerCase()}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer",
              collapsed && "justify-center px-2"
            )}
            onClick={() => dispatch(logout())}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2 text-sm">Log out</span>}
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}