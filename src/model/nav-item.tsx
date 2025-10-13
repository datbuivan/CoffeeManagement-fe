import { LucideIcon } from "lucide-react";
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[]; 
  badge?: string;
}