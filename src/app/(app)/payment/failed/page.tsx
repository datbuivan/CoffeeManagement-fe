"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="max-w-md w-full shadow-lg border-0">
        <CardHeader className="text-center">
          <XCircle className="text-red-500 w-16 h-16 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-red-600">
            Thanh toán thất bại 😞
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <Alert variant="destructive">
            <AlertTitle>Giao dịch không thành công</AlertTitle>
            <AlertDescription>
              {orderId ? (
                <>
                  Mã đơn hàng: <span className="font-mono">{orderId}</span>
                </>
              ) : (
                "Không tìm thấy mã đơn hàng trong yêu cầu"
              )}
            </AlertDescription>
          </Alert>

          <div className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/cart")} className="bg-blue-600 hover:bg-blue-700">
              Thử thanh toán lại
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Quay lại trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
