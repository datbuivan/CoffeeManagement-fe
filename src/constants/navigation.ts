import { NavItem, Role, ROLES } from "@/model/nav-item";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  CheckSquare,
  Clock,
  Shield,
  Folder,
} from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Folder,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Tables",
    href: "/tables",
    icon: CheckSquare,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Roles",
    href: "/roles",
    icon: Shield,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Schedule",
    href: "/schedules",
    icon: Clock,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "My-Schedule",
    href: "/my-schedule",
    icon: Clock,
    roles: [ROLES.MANAGER, ROLES.STAFF],
  },
];

export function getNavItemsForRole(roleName: string): NavItem[] {
  // Ép kiểu string sang Role
  const role = roleName as Role;
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
export function canAccessRoute(roleName: string, path: string): boolean {
  const role = roleName as Role;
  const navItem = NAV_ITEMS.find((item) => path.startsWith(item.href));
  if (!navItem) return true;
  return navItem.roles.includes(role);
}
