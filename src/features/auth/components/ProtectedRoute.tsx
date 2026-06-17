import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetMeQuery } from "@/features/users/api/usersApi";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();

  const {
    data: user,
    isLoading,
    isError,
  } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}