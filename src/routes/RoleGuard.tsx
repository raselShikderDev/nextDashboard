import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { Role } from "@/types/enums";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // SUPER_ADMIN bypasses all restrictions
  if (user.role === Role.SUPER_ADMIN) {
    return <>{children}</>;
  }

  if (!allowedRoles.includes(user?.role as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}