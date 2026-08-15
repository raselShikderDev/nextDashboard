import { useMemo } from "react";
import { useAppSelector } from "@/app/hooks";
import { Role } from "@/types/enums";
import { APP_ROUTES, RouteConfig } from "@/routes/route";


function flattenRoutes(routes: RouteConfig[]): RouteConfig[] {
  return routes.reduce((acc, route) => {
    acc.push(route);
    if (route.children) acc.push(...route.children);
    return acc;
  }, [] as RouteConfig[]);
}

const ALL_ROUTE_PATHS = flattenRoutes(APP_ROUTES);

export function usePermission() {
  const user = useAppSelector((s) => s.auth.user);
  const userRole = user?.role;
  const isSuperAdmin = userRole === Role.SUPER_ADMIN;

  const hasRole = (...roles: Role[]) => {
    if (!userRole) return false;
    if (isSuperAdmin) return true;
    return roles.includes(userRole as Role);
  };

  const canAccess = (path: string) => {
    if (isSuperAdmin) return true;
    const route = ALL_ROUTE_PATHS.find((r) => r.path === path);
    if (!route) return false;
    return route.allowedRoles.includes(userRole as Role);
  };

  const visibleNavItems = useMemo(() => {
    if (isSuperAdmin) return APP_ROUTES;
    return APP_ROUTES.filter((item) => {
      const parentAllowed = item.allowedRoles.includes(userRole as Role);
      if (!item.children) return parentAllowed;

      const visibleChildren = item.children.filter((child) =>
        child.allowedRoles.includes(userRole as Role)
      );

      // Keep parent only if it has visible children
      return visibleChildren.length > 0;
    }).map((item) => ({
      ...item,
      children: item.children?.filter((child) =>
        child.allowedRoles.includes(userRole as Role)
      ),
    }));
  }, [userRole, isSuperAdmin]);

  return { userRole, isSuperAdmin, hasRole, canAccess, visibleNavItems };
}