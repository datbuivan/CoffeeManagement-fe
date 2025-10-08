"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Home, Coffee, FileText, Users, BarChart, Settings, X, Table, Folder, Calendar } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 flex-col border-r bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] transition-transform duration-300 ease-in-out -translate-x-full",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/" className="text-xl h-full font-bold text-[#6B4E31] flex items-center space-x-2">
            <Coffee className="h-6 w-6 sm:h-7 sm:w-7 text-[#6B4E31] align-middle" />
                <span className="align-middle">Quán Cà Phê</span>
        </Link>
        <button onClick={onToggle}>
          <X className="h-6 w-6 text-[#6B4E31]" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {[
          { href: "/", label: "Dashboard", icon: Home },
          { href: "/orders", label: "Đơn hàng", icon: Coffee },
          { href: "/products", label: "Sản phẩm", icon: FileText },
          { href: "/categories", label: "Danh mục sản phẩm", icon: Folder },
          { href: "/tables", label: "Bàn", icon: Table },
          { href: "/users", label: "Nhân viên", icon: Users },
          { href: "/schedules", label: "Lịch làm nhân viên", icon: Calendar },
          { href: "/reports", label: "Báo cáo", icon: BarChart },
          { href: "/settings", label: "Cài đặt", icon: Settings },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-[#EED6B3] transition-colors duration-200"
            onClick={onToggle}
          >
            <item.icon className="h-5 w-5" /> {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}