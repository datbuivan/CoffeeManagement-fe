"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./header";
import Sidebar from "./sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getTitleFromPath = (path: string): string => {
    switch (path) {
      case "/":
        return "Dashboard";
      case "/orders":
        return "Đơn hàng";
      case "/products":
        return "Sản phẩm";
      case "/categories":
        return "Danh mục sản phẩm";
      case "/tables":
        return "Danh mục bàn"
      case "/staffs":
        return "Nhân viên";
      case "/reports":
        return "Báo cáo";
      case "/schedules":
        return "Lịch làm nhân viên";
      case "/settings":
        return "Cài đặt";
      default:
        return "";
    }
  };

  const title = getTitleFromPath(pathname);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] overflow-hidden">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/50"
          onClick={toggleSidebar}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''}`}>
        <Header onSidebarToggle={toggleSidebar} title={title} />
        <main className="flex-1 overflow-auto bg-gradient-to-tl from-[#F3F2EC] to-[#E9E3DF]">{children}</main>
      </div>
    </div>
  );
}