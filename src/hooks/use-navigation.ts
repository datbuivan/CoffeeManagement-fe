import { canAccessRoute, getNavItemsForRole } from "@/constants/navigation";
import { useAuth } from "@/context/authContext";
import { NavItem } from "@/model/nav-item";

export function useNavigation() {
  const { user, isAuthenticated } = useAuth();

  const navItems: NavItem[] =
    isAuthenticated && user ? getNavItemsForRole(user.roleName) : [];

  const canAccess = (path: string): boolean => {
    if (!isAuthenticated || !user) return false;
    return canAccessRoute(user.roleName, path);
  };

  return {
    navItems,
    canAccess,
  };
}
