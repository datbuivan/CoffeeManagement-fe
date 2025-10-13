"use client";

import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import { RouteGuard } from "../auth/route-guard";
import { useAxiosInterceptor } from "@/hooks/use-axios-interceptor";
import { useRouteLoading } from "@/hooks/use-route-loading";
import LoadingOverlay from "../loading-overlay";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAxiosInterceptor();
  useRouteLoading(); 
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  return (
    <RouteGuard>
      <div className="flex h-screen bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] overflow-hidden">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black/50"
            onClick={toggleSidebar}
          />
        )}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''}`}>
          <Header onSidebarToggle={toggleSidebar} />
          <main className="flex-1 overflow-auto bg-gradient-to-tl from-[#F3F2EC] to-[#E9E3DF]">{children}</main>
        </div>
      </div>
      <LoadingOverlay /> 
    </RouteGuard>
  );
}