import "../../app/globals.css";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        {children}
      </div>
      </body>
    </html>
  );
}
