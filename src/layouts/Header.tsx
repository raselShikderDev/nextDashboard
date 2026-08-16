import { Bell, Menu, Moon, Sun, Settings, LogOut, UserCircle, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { togglePanel } from "../features/notifications/slice/notificationsSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { logout } from "../features/auth/slice/authSlice";
import { useState, useEffect } from "react";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { formatRole, getInitials } from "@/helpers/helpers";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Read from Redux (hydrated by AuthProvider)
  const user = useAppSelector((state) => state.auth.user);

  const [logoutMutation, { isLoading: logoutLoading }] = useLogoutMutation();
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const handleLogout = () => {
    logoutMutation();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              Logged in as {user?.userDetails?.name || "User"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setIsDark((d) => !d)}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full relative" onClick={() => dispatch(togglePanel())}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-11 px-2 rounded-xl border hover:bg-muted/60">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.userDetails?.avatarUrl || ""} alt={user.userDetails?.name || user.email} />
                    <AvatarFallback>{getInitials(user.userDetails?.name || user.email)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start ml-2">
                    <span className="text-sm font-medium leading-none">{user.userDetails?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{formatRole(user.role)}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72 p-0 overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.userDetails?.avatarUrl || ""} />
                      <AvatarFallback>{getInitials(user.userDetails?.name || user.email)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{user.userDetails?.name || "User"}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <span className="inline-flex mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {formatRole(user.role)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                    <UserCircle className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                <div className="p-2">
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={handleLogout}  //  fixed: was dispatch(handleLogout)
                    disabled={logoutLoading}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}