import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { RequestsPage } from "../features/requests/pages/RequestsPage";
import { PaymentsPage } from "../features/payments/pages/PaymentsPage";
import { UsersPage } from "../features/users/pages/UsersPage";
import { ServicesPage } from "../features/services/pages/ServicesPage";
import { NotificationsPage } from "../features/notifications/pages/NotificationsPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";
import { ServiceCategoriesPage } from "@/features/services/pages/ServiceCategoriesPage";
import { GuestRequestPage } from "@/features/requests/pages/GuestRequestPage";
import { Role } from "@/types/enums";
import { RoleGuard } from "./RoleGuard";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
      <p className="text-6xl font-bold text-muted-foreground">403</p>
      <h1 className="text-2xl font-semibold">Access Denied</h1>
      <p className="text-muted-foreground">
        You don't have permission to view this page.
      </p>
    </div>
  );
}

// Helper to wrap pages with role checks
const allow = (element: React.ReactNode, roles: Role[]) => (
  <RoleGuard allowedRoles={roles}>{element}</RoleGuard>
);

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "requests/guest", element: <GuestRequestPage /> },

  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },

          // All admin-level roles
          {
            path: "dashboard",
            element: allow(<DashboardPage />, [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]),
          },
          {
            path: "requests",
            element: allow(<RequestsPage />, [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]),
          },
          {
            path: "payments",
            element: allow(<PaymentsPage />, [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]),
          },
          {
            path: "notifications",
            element: allow(<NotificationsPage />, [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]),
          },
          {
            path: "settings",
            element: allow(<SettingsPage />, [Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]),
          },

          // Admin & Super Admin only
          {
            path: "users",
            element: allow(<UsersPage />, [Role.ADMIN, Role.SUPER_ADMIN]),
          },
          {
            path: "services",
            element: allow(<ServicesPage />, [Role.ADMIN, Role.SUPER_ADMIN]),
          },
          {
            path: "services/categories",
            element: allow(<ServiceCategoriesPage />, [Role.ADMIN, Role.SUPER_ADMIN]),
          },

          { path: "unauthorized", element: <Unauthorized /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);