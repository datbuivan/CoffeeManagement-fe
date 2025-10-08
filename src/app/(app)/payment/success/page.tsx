"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`
        );
        const data = await res.json();
        setIsPaid(data?.isPaid ?? false);
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái thanh toán:", err);
        setIsPaid(false);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12 mb-4" />
        <p className="text-gray-600 text-lg">Đang xác nhận thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="max-w-md w-full shadow-lg border-0">
        <CardHeader className="text-center">
          <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-green-600">
            Thanh toán thành công 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <Alert className="border-green-500">
            <AlertTitle className="font-semibold text-green-700">
              Cảm ơn bạn đã thanh toán!
            </AlertTitle>
            <AlertDescription>
              Mã đơn hàng: <span className="font-mono">{orderId}</span>
            </AlertDescription>
          </Alert>

          <div className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/orders")} className="bg-blue-600 hover:bg-blue-700">
              Xem đơn hàng
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
