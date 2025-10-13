import { AuthProvider } from "@/context/authContext";
import "../../app/globals.css";
import { Toaster as SonnerToaster } from "sonner";


export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <AuthProvider>{children}</AuthProvider>
        <SonnerToaster richColors position="top-right" /> 
      </div>
      </body>
    </html>
  );
}
