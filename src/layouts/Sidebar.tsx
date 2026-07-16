import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  Package,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
  FolderTree,
  Tags,
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
import { useGetMeQuery } from "@/features/users/api/usersApi";
import { getInitials } from "@/app/helpers/helpers";

interface NavItem {
  to?: string;
  icon: LucideIcon;
  label: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/requests", icon: FileText, label: "Requests" },
  { to: "/payments", icon: CreditCard, label: "Payments" },
  { to: "/users", icon: Users, label: "Users" },
  {
    icon: Package,
    label: "Services",
    children: [
      { to: "/services", icon: Package, label: "All Services" },
      { to: "/services/categories", icon: FolderTree, label: "Categories" },
    ],
  },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// exact match or route is a sub-path — avoids "/services" matching "/services/categories"
const isPathActive = (pathname: string, to?: string) =>
  !!to && (pathname === to || pathname.startsWith(`${to}/`));

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const dispatch = useAppDispatch();
  const { data: user, isLoading: getMeLoading } = useGetMeQuery();
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const location = useLocation();

  // manual open/close state; falls back to "open if a child route is active"
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
        {/* header — unchanged */}
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
          {NAV_ITEMS.map((item) => {
            const { icon: Icon, label, children } = item;

            // ---------- Group with children ----------
            if (children?.length) {
              const childActive = children.some((c) =>
                isPathActive(location.pathname, c.to),
              );
              const isOpen = openGroups[label] ?? childActive;

              // Collapsed: icon button opens a flyout with the children
              if (collapsed) {
                return (
                  <Popover key={label}>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "flex w-full items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                          childActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      sideOffset={12}
                      className="w-48 p-1.5"
                    >
                      <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </p>
                      {children.map((child) => {
                        const ChildIcon = child.icon;
                        const active = isPathActive(location.pathname, child.to);
                        return (
                          <NavLink
                            key={child.to}
                            to={child.to!}
                            className={cn(
                              "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
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

              // Expanded: accordion with animated submenu
              return (
                <div key={label}>
                  <button
                    onClick={() => toggleGroup(label)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                      childActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left whitespace-nowrap">
                      {label}
                    </span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-90",
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
                            const active = isPathActive(
                              location.pathname,
                              child.to,
                            );
                            return (
                              <NavLink
                                key={child.to}
                                to={child.to!}
                                className={cn(
                                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                                  active
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                              >
                                <ChildIcon className="w-4 h-4 shrink-0" />
                                <span className="whitespace-nowrap">
                                  {child.label}
                                </span>
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

            // ---------- Flat item (same as before) ----------
            const isActive = isPathActive(location.pathname, item.to);
            const showBadge = label === "Notifications" && unreadCount > 0;
            const navContent = (
              <NavLink
                to={item.to!}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {showBadge && (
                  <span
                    className={cn(
                      "absolute flex items-center justify-center text-xs font-bold rounded-full bg-destructive text-destructive-foreground",
                      collapsed
                        ? "top-1 right-1 w-4 h-4 text-[10px]"
                        : "ml-auto w-5 h-5",
                    )}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </NavLink>
            );
            return collapsed ? (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{navContent}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.to}>{navContent}</div>
            );
          })}
        </nav>

      </motion.aside>
    </TooltipProvider>
  );
}