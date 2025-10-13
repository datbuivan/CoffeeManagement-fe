"use client";

import { NAV_ITEMS } from "@/constants/navigation";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Menu, User } from "lucide-react";
import { useAuth } from "@/context/authContext";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const currentPage = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  const title = currentPage?.label || "Dashboard";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed in Header:", error);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] px-6">
      {/* Left: Menu toggle + title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onSidebarToggle}>
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>

      {/* Right: Notifications + User Menu */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="/default-avatar.jpg" />
              <AvatarFallback>NV</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user.fullName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                router.push("/profile");
              }}
            >
              <User className="mr-2 h-4 w-4" /> {/* Icon */}
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer focus:text-red-600"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
