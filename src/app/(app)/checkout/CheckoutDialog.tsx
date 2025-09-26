// components/order/CheckoutDialog.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Landmark, Wallet, Loader2 } from "lucide-react";

type PaymentMethod = "cash" | "transfer";
type DialogView = "selectMethod" | "showQR" | "paymentSuccess";

interface CheckoutDialogProps {
  total: number;
  onSuccess: () => void;
  children: React.ReactNode;
}

// Giả lập hàm gọi API để tạo mã QR
async function generateVNPayQR(amount: number): Promise<{ qrUrl: string; orderId: string }> {
  console.log("Đang gọi API để tạo mã QR cho số tiền:", amount);
  // Trong thực tế, bạn sẽ gọi backend của mình ở đây
  // const response = await fetch('/api/payment/vnpay', { method: 'POST', body: JSON.stringify({ amount }) });
  // const data = await response.json();
  // return data;

  // Dữ liệu giả lập
  await new Promise(resolve => setTimeout(resolve, 1500)); // Giả lập độ trễ mạng
  return {
    qrUrl: "/vnpay-qr-code-placeholder.png", // Thay bằng URL mã QR thật
    orderId: `order_${Date.now()}`, // ID đơn hàng để kiểm tra trạng thái
  };
}

export default function CheckoutDialog({ total, onSuccess, children }: CheckoutDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<DialogView>("selectMethod");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset về trạng thái ban đầu khi dialog đóng
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("selectMethod");
        setQrCodeUrl(null);
        setIsLoading(false);
      }, 300); // Đợi animation đóng xong
    }
  }, [isOpen]);

  const handleConfirmPayment = async () => {
    if (paymentMethod === "cash") {
      onSuccess();
      setIsOpen(false);
    } else { // Chuyển khoản
      setIsLoading(true);
      try {
        // 1. Gọi API để lấy mã QR
        const { qrUrl, orderId } = await generateVNPayQR(total);
        setQrCodeUrl(qrUrl);
        setView("showQR");

        // 2. (Tùy chọn) Bắt đầu kiểm tra trạng thái thanh toán
        // Bạn có thể dùng polling hoặc WebSocket ở đây
        // checkPaymentStatus(orderId);
      } catch (error) {
        console.error("Lỗi khi tạo mã QR:", error);
        // Hiển thị thông báo lỗi
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderContent = () => {
    switch (view) {
      case "showQR":
        return (
          <div>
            <DialogHeader>
              <DialogTitle>Quét mã để thanh toán</DialogTitle>
              <DialogDescription>
                Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR VNPay.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center my-6">
              {qrCodeUrl ? (
                <Image src={qrCodeUrl} alt="VNPay QR Code" width={250} height={250} />
              ) : (
                <div className="h-[250px] w-[250px] bg-gray-200 animate-pulse rounded-md" />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setView("selectMethod")}>Quay lại</Button>
              <Button onClick={() => {
                // Giả lập thanh toán thành công
                onSuccess();
                setIsOpen(false);
              }}>
                Tôi đã thanh toán
              </Button>
            </DialogFooter>
          </div>
        );
      case "selectMethod":
      default:
        return (
          <div>
            <DialogHeader>
              <DialogTitle>Xác nhận thanh toán</DialogTitle>
              <DialogDescription>
                Tổng số tiền là <strong>{total.toLocaleString()} đ</strong>. Vui lòng chọn phương thức.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                variant={paymentMethod === "cash" ? "default" : "outline"}
                className="w-full justify-start gap-3 p-6 text-lg"
                onClick={() => setPaymentMethod("cash")}
              >
                <Wallet /> Tiền mặt
              </Button>
              <Button
                variant={paymentMethod === "transfer" ? "default" : "outline"}
                className="w-full justify-start gap-3 p-6 text-lg"
                onClick={() => setPaymentMethod("transfer")}
              >
                <Landmark /> Chuyển khoản
              </Button>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Hủy</Button>
              </DialogClose>
              <Button onClick={handleConfirmPayment} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận
              </Button>
            </DialogFooter>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}