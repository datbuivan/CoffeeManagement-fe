// app/checkout/PaymentActions.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CheckoutDialog from "./CheckoutDialog"; // Giả sử bạn di chuyển file CheckoutDialog vào cùng thư mục

interface PaymentActionsProps {
  finalTotal: number;
  onPaymentSuccess: () => void;
}

export function PaymentActions({ finalTotal, onPaymentSuccess }: PaymentActionsProps) {
  const router = useRouter();

  // Hàm này sẽ được gọi từ bên trong CheckoutDialog sau khi thanh toán thành công
  const handleSuccess = () => {
    onPaymentSuccess();
  };

  return (
    <div className="mt-4 flex justify-between shrink-0">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
      >
        &lt; Quay lại
      </Button>

      <div className="flex gap-2">
        {/* Bọc nút "$ Thanh toán" trong CheckoutDialog */}
        <CheckoutDialog total={finalTotal} onSuccess={handleSuccess}>
          <Button className="bg-[#6B4E31] hover:bg-[#8a6f54] text-white">
            $ Thanh toán
          </Button>
        </CheckoutDialog>

        {/* Nút "Thanh toán & In" cũng có thể mở cùng một Dialog */}
        <CheckoutDialog total={finalTotal} onSuccess={handleSuccess}>
          <Button className="bg-[#6B4E31] hover:bg-[#8a6f54] text-white">
            Thanh toán & In hóa đơn
          </Button>
        </CheckoutDialog>
      </div>
    </div>
  );
}