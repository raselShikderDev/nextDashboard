import { Navigate, useLocation } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { canAccess } = usePermission();
  const location = useLocation();

  if (!canAccess(location.pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}