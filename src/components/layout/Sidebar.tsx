"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getNavItemsForRole } from "@/constants/navigation";
import { useAuth } from "@/context/authContext";
import { Role } from "@/model/nav-item";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user) return null;
  const roleName = (user.roleName || "").toUpperCase() as Role;

  if (!user) return null;

  // Lọc menu theo role
  const navItems = getNavItemsForRole(roleName);

  
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 flex-col bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <h2 className="text-xl font-bold">{user.fullName}</h2>
        <button onClick={onToggle}>
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex-col gap-2 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? ``
                  : ``
              )}
              onClick={onToggle}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
