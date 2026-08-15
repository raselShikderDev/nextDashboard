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
import { RoleGuard } from "./RoleGuard";
import Unauthorized from "@/layouts/Unauthorized";
import NotFound from "@/layouts/Notfound";


// Helper: wraps page with RoleGuard (reads permissions from routes.ts automatically)
function SecurePage({ children }: { children: React.ReactNode }) {
  return <RoleGuard>{children}</RoleGuard>;
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "requests/guest", element: <GuestRequestPage /> },

  {
    path: "/",
    element: <ProtectedRoute />, // auth check (logged in?)
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <SecurePage><DashboardPage /></SecurePage> },
          { path: "requests", element: <SecurePage><RequestsPage /></SecurePage> },
          { path: "payments", element: <SecurePage><PaymentsPage /></SecurePage> },
          { path: "users", element: <SecurePage><UsersPage /></SecurePage> },
          { path: "services", element: <SecurePage><ServicesPage /></SecurePage> },
          { path: "services/categories", element: <SecurePage><ServiceCategoriesPage /></SecurePage> },
          { path: "notifications", element: <SecurePage><NotificationsPage /></SecurePage> },
          { path: "settings", element: <SecurePage><SettingsPage /></SecurePage> },
          { path: "unauthorized", element: <Unauthorized /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);