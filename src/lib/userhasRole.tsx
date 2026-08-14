import { useAppSelector } from "@/app/hooks";
import { Role } from "@/types/enums";

export function useHasRole(...roles: Role[]) {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return false;
  if (user.role === Role.SUPER_ADMIN) return true;
  return roles.includes(user.role as Role);
}


// const canManageUsers = useHasRole(Role.ADMIN, Role.SUPER_ADMIN);

// {canManageUsers && <Button onClick={...}>Delete User</Button>}