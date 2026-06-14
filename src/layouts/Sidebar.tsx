import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileText, CreditCard, Users, Package, Bell, Settings, ChevronLeft, ChevronRight, Shield, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/slice/authSlice";
import { getInitials } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/requests", icon: FileText, label: "Requests" },
  { to: "/payments", icon: CreditCard, label: "Payments" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/services", icon: Package, label: "Services" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative flex flex-col h-screen bg-card border-r border-border shrink-0 z-30 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="font-bold text-lg whitespace-nowrap">
                AdminPro
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive = to === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(to);
            const showBadge = label === "Notifications" && unreadCount > 0;
            const navContent = (
              <NavLink to={to} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group", isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <Icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">{label}</motion.span>
                  )}
                </AnimatePresence>
                {showBadge && (
                  <span className={cn("absolute flex items-center justify-center text-xs font-bold rounded-full bg-destructive text-destructive-foreground", collapsed ? "top-1 right-1 w-4 h-4 text-[10px]" : "ml-auto w-5 h-5")}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </NavLink>
            );
            return collapsed ? (
              <Tooltip key={to}><TooltipTrigger asChild>{navContent}</TooltipTrigger><TooltipContent side="right">{label}</TooltipContent></Tooltip>
            ) : (
              <div key={to}>{navContent}</div>
            );
          })}
        </nav>

        <div className="border-t border-border p-2 shrink-0">
          {user && (
            <div className={cn("flex items-center gap-3 px-2 py-2 rounded-lg", collapsed ? "justify-center" : "")}>
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!collapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => dispatch(logout())}><LogOut className="w-4 h-4" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Logout</TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        <Button variant="outline" size="icon" className="absolute -right-3 top-[4.5rem] h-6 w-6 rounded-full border bg-background shadow-md z-10" onClick={onToggle}>
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}
