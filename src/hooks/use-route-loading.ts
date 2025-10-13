"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoadingStore } from "@/store/loading.store";

export function useRouteLoading() {
  const pathname = usePathname();
  const { startLoading, stopLoading } = useLoadingStore();

  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => stopLoading(), 400); // nhỏ delay tránh nháy
    return () => clearTimeout(timer);
  }, [pathname]);
}
