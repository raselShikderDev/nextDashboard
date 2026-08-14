import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { Role } from "@/types/enums";

export function ProtectedRoute() {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin dashboard is only for ADMIN, MANAGER, SUPER_ADMIN
  if (user.role === Role.USER) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}