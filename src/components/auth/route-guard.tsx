"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { canAccessRoute } from "@/constants/navigation";
import { useAuth } from "@/context/authContext";


export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user && !canAccessRoute(user.roleName, pathname)) {
      router.push("/unauthorized");
      return;
    }
  }, [isAuthenticated, user, pathname, router, loading]);

  if (loading || !user || !canAccessRoute(user.roleName, pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}