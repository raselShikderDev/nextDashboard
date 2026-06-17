import { Bell, Moon, Sun, Search, Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { togglePanel } from "../features/notifications/slice/notificationsSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { getInitials } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { logout } from "../features/auth/slice/authSlice";
import { useState, useEffect } from "react";
import { useGetMeQuery } from "@/features/users/api/usersApi";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: user, isLoading } = useGetMeQuery();

  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  console.log("Current User:", user);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-9 bg-muted/50 border-transparent focus:border-input h-9"
          />
        </div>
      </div>

      <div className="flex-1 sm:flex-none" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setIsDark((d) => !d)}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          onClick={() => dispatch(togglePanel())}
        >
          <Bell className="w-4 h-4" />

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        {!isLoading && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <Avatar className="w-7 h-7">
                  <AvatarImage
                    src={user?.userDetails?.avatarUrl || ""}
                    alt={user?.userDetails?.name || user.email}
                  />

                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {getInitials(user.userDetails?.name || user.email)}
                  </AvatarFallback>
                </Avatar>

                <span className="text-sm font-medium hidden sm:block">
                  {user.userDetails?.name || user.email}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">
                    {user.userDetails?.name || "User"}
                  </p>

                  <p className="text-xs text-muted-foreground font-normal">
                    {user.email}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => dispatch(logout())}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
