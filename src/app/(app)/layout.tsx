
import type { Metadata } from "next";
import "../../app/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import ClientLayout from "@/components/layout/client-layout";
import { Toaster as SonnerToaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Quán Cà Phê",
  description: "Đồ án quản lý quán cà phê",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={cn("min-h-screen bg-[#F5F0E8] antialiased", inter.className)}>
        <ClientLayout>{children}</ClientLayout>
        <SonnerToaster richColors position="top-right" /> 
      </body>
    </html>
  );
}
