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

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
      <p className="text-6xl font-bold text-muted-foreground">403</p>
      <h1 className="text-2xl font-semibold">Access Denied</h1>
      <p className="text-muted-foreground">You don't have permission to view this page.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [{
      element: <AdminLayout />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "requests", element: <RequestsPage /> },
        { path: "payments", element: <PaymentsPage /> },
        { path: "users", element: <UsersPage /> },
        { path: "services", element: <ServicesPage /> },
        { path: "notifications", element: <NotificationsPage /> },
        { path: "settings", element: <SettingsPage /> },
        { path: "unauthorized", element: <Unauthorized /> },
        { path: "*", element: <NotFound /> },
      ],
    }],
  },
]);
