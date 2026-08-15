import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  Package,
  Bell,
  Settings,
  FolderTree,
  type LucideIcon,
} from "lucide-react";
import { Role } from "@/types/enums";

export interface RouteConfig {
  path: string;
  label: string;
  icon: LucideIcon;
  allowedRoles: Role[];
  children?: RouteConfig[];
}

export const APP_ROUTES: RouteConfig[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN],
  },
  {
    path: "/requests",
    label: "Requests",
    icon: FileText,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN],
  },
  {
    path: "/payments",
    label: "Payments",
    icon: CreditCard,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN],
  },
  {
    path: "/users",
    label: "Users",
    icon: Users,
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN], 
  },
  {
    path: "/services",
    label: "Services",
    icon: Package,
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
    children: [
      {
        path: "/services",
        label: "All Services",
        icon: Package,
        allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
      },
      {
        path: "/services/categories",
        label: "Categories",
        icon: FolderTree,
        allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
      },
    ],
  },
  {
    path: "/notifications",
    label: "Notifications",
    icon: Bell,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN],
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
    allowedRoles: [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN],
  },
];