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
import { Role } from "@/types/enums";

interface NavItem {
  to?: string;
  icon: LucideIcon;
  label: string;
  roles?: Role[];
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN] },
  { to: "/requests", icon: FileText, label: "Requests", roles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN] },
  { to: "/payments", icon: CreditCard, label: "Payments", roles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN] },
  { to: "/users", icon: Users, label: "Users", roles: [Role.ADMIN, Role.SUPER_ADMIN] },
  {
    icon: Package,
    label: "Services",
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
    children: [
      { to: "/services", icon: Package, label: "All Services", roles: [Role.ADMIN, Role.SUPER_ADMIN] },
      { to: "/services/categories", icon: FolderTree, label: "Categories", roles: [Role.ADMIN, Role.SUPER_ADMIN] },
    ],
  },
  { to: "/notifications", icon: Bell, label: "Notifications", roles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN] },
  { to: "/settings", icon: Settings, label: "Settings", roles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN] },
];

// exact match or route is a sub-path
const isPathActive = (pathname: string, to?: string) =>
  !!to && (pathname === to || pathname.startsWith(`${to}/`));

function filterNavByRole(items: NavItem[], userRole?: Role): NavItem[] {
  if (!userRole) return [];
  if (userRole === Role.SUPER_ADMIN) return items;

  return items
    .filter((item) => !item.roles || item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) => !child.roles || child.roles.includes(userRole)
      ),
    }))
    .filter((item) => !item.children || item.children.length > 0);
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const visibleNavItems = filterNavByRole(NAV_ITEMS, user?.role  as Role);

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
        {/* header */}
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

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "ml-auto h-8 w-8 shrink-0 cursor-pointer",
              collapsed && "absolute -right-3 top-5 bg-card border shadow-sm"
            )}
            onClick={onToggle}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {visibleNavItems.map((item) => {
            const { icon: Icon, label, children } = item;

            // ---------- Group with children ----------
            if (children?.length) {
              const childActive = children.some((c) =>
                isPathActive(location.pathname, c.to)
              );
              const isOpen = openGroups[label] ?? childActive;

              // Collapsed: icon button opens a flyout
              if (collapsed) {
                return (
                  <Popover key={label}>
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
                <div key={label}>
                  <button
                    onClick={() => toggleGroup(label)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
                      childActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left whitespace-nowrap">
                      {label}
                    </span>
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
                            const active = isPathActive(
                              location.pathname,
                              child.to
                            );
                            return (
                              <NavLink
                                key={child.to}
                                to={child.to!}
                                className={cn(
                                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
                                  active
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

            // ---------- Flat item ----------
            const isActive = isPathActive(location.pathname, item.to);
            const showBadge = label === "Notifications" && unreadCount > 0;
            const navContent = (
              <NavLink
                to={item.to!}
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
                        : "ml-auto w-5 h-5"
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

        {/* Footer: User + Logout */}
        <div className="shrink-0 border-t border-border p-3 space-y-2">
          <div
            className={cn(
              "flex items-center gap-3 px-2 py-2 rounded-lg",
              collapsed && "justify-center"
            )}
          >
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
                <p className="text-sm font-medium truncate">
                  {user?.userDetails?.name || user?.email || "User"}
                </p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {user?.role?.toLowerCase()}
                </p>
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