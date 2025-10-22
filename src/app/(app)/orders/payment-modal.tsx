"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { User } from "lucide-react";
import { CartItem } from "@/model/cart-item.model";
import { Table } from "@/model/table.model";
import { toast } from "sonner";
import { CreateOrder } from "@/model/create-order.model";
import { orderService } from "@/services/order.service";
import { VnPay } from "@/model/vnpay.model";
import { useRouter } from "next/navigation";


interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  selectedTable: Table | null;
  onConfirmPayment: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  cart,
  selectedTable,
  onConfirmPayment,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "VnPay">("Cash");
  const [customerPaid, setCustomerPaid] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.size.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const quickAmounts = [10000, 20000, 50000, 100000, 200000, 500000];
  const change = customerPaid - total;
  const router = useRouter();


  useEffect(() => {
    if (isOpen) {
      setCustomerPaid(0);
      setPaymentMethod("Cash");
      setPaymentUrl(null);
      setIsProcessing(false);
      setHasInteracted(false);
    }
  }, [isOpen]);

  // Tự động gọi API khi chuyển sang VnPay
  useEffect(() => {
    if (paymentMethod === "VnPay" && !paymentUrl && !isProcessing && isOpen) {
      handlePayment("VnPay");
    }
  }, [paymentMethod]);

  const handlePayment = async (method: "Cash" | "VnPay") => {
    const userInfoString = localStorage.getItem("user");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const userId = userInfo?.id || "";

    if (method === "Cash") {
      if (customerPaid < total) {
        if (hasInteracted) {
          toast.error("Số tiền khách trả chưa đủ!");
        }
        return;
      }
    }

    const payload: CreateOrder = {
      userId: userId,
      tableId: selectedTable?.id || null,
      paymentMethod: method,
      discountAmount: 0,
      items: cart.map(item => ({
        productSizeId: item.size.id,
        quantity: item.qty,
      })),
    };

    try {
      setIsProcessing(true);
      console.log("Payload", payload);
      const res = await orderService.createAndPayOrder(payload);
      if (res.statusCode !== 200) {
        toast.error(res.message || "Tạo đơn hàng thất bại!");
        return;
      }
      if (method === "Cash") {
        const change = customerPaid - total;
        toast.success(
          `Thanh toán thành công!${change > 0 ? ` Tiền thừa: ${change.toLocaleString("vi-VN")}đ` : ""}`
        );
        localStorage.removeItem("cart");
        onConfirmPayment();
        onClose();
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else if (method === "VnPay") {
        const vnPayData = res.data as VnPay;
        const vnPayUrl = vnPayData?.paymentUrl;
        
        if (vnPayUrl && typeof vnPayUrl === 'string' && vnPayUrl.trim() !== '') {
          setPaymentUrl(vnPayUrl);
          toast.success("Quét mã QR để thanh toán");
        } else {
          toast.error("Không nhận được link thanh toán VnPay!");
        }
      }
      
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Lỗi khi tạo đơn hàng!";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    if (value === "Cash") {
      setPaymentMethod("Cash");
      setPaymentUrl(null);
      setHasInteracted(false);
    } else if (value === "VnPay") {
      setPaymentMethod("VnPay");
      setPaymentUrl(null);
      setHasInteracted(false);
      // useEffect sẽ tự động gọi API
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="max-w-4xl w-full sm:max-w-[850px] overflow-y-auto bg-white p-0"
      >
        <div className="flex h-full">
          {/* LEFT SIDE - Order Details */}
          <div className="w-1/2 border-r p-6 overflow-y-auto bg-white">
            <SheetHeader className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-xl font-bold">
                    {selectedTable ? `Thanh toán #${selectedTable.name}` : "Thanh toán"}
                  </SheetTitle>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {new Date().toLocaleString("vi-VN")}
                </div>
              </div>
            </SheetHeader>

            {/* Customer Info */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Khách lẻ</span>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-2 text-xs font-semibold text-gray-600 mb-2 pb-2 border-b">
                <div>ĐỒ UỐNG</div>
                <div className="text-center">SL</div>
                <div className="text-right">ĐƠN GIÁ</div>
                <div className="text-right">THÀNH TIỀN</div>
              </div>
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-2 py-2 border-t text-sm"
                >
                  <div>
                    <span className="text-gray-500">{index + 1}. </span>
                    {item.product.name}
                  </div>
                  <div className="text-center">{item.qty}</div>
                  <div className="text-right">
                    {item.size.price.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-right font-semibold">
                    {(item.size.price * item.qty).toLocaleString("vi-VN")}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="border-t pt-3">
              <div className="flex justify-between text-sm py-2">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <div className="flex gap-8">
                  <span className="font-semibold">{itemCount}</span>
                  <span className="font-semibold w-24 text-right">
                    {total.toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Payment */}
          <div className="w-1/2 p-6 flex flex-col bg-white">
            <h3 className="font-semibold text-lg mb-4">Chi tiết thanh toán</h3>

            {/* Payment method */}
            <RadioGroup
              value={paymentMethod}
              onValueChange={handlePaymentMethodChange}
              className="flex gap-6 mb-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Cash" id="Cash" />
                <Label htmlFor="Cash">Tiền mặt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="VnPay" id="VnPay" />
                <Label htmlFor="VnPay">Chuyển khoản (VNPAY)</Label>
              </div>
            </RadioGroup>

            {paymentMethod === "Cash" && (
              <>
                <div className="flex justify-between py-2 items-center">
                  <span className="text-gray-600">Khách thanh toán</span>
                  <input
                    type="text"
                    value={customerPaid > 0 ? customerPaid.toLocaleString("vi-VN") : ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setCustomerPaid(Number(val));
                    }}
                    placeholder="0"
                    className="text-right font-bold text-blue-600 text-lg border-b-2 border-blue-600 outline-none w-32 px-2"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => {setCustomerPaid(amount); setHasInteracted(true);}}
                      className="h-12 text-sm font-semibold hover:bg-blue-50"
                    >
                      {amount.toLocaleString("vi-VN")}
                    </Button>
                  ))}
                </div>
                {customerPaid > 0 && (
                  <div className="flex justify-between py-3 mt-4 border-t">
                    <span className="text-gray-600">Tiền thừa trả khách</span>
                    <span className={`font-bold text-lg ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                )}
              </>
            )}

            {paymentMethod === "VnPay" && (
              <div className="text-center mt-6">
                {paymentUrl ? (
                  <>
                    <p className="text-gray-600 mb-4">
                      Quét mã QR hoặc nhấn vào nút bên dưới để thanh toán
                    </p>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentUrl)}`}
                      alt="Mã QR thanh toán VNPAY"
                      className="mx-auto h-64 w-64 border rounded-lg"
                    />
                    <Button
                      asChild
                      className="mt-4 w-full bg-green-600 hover:bg-green-700"
                    >
                      <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                        Mở trang thanh toán
                      </a>
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm mt-4">Đang tạo mã thanh toán...</p>
                )}

              </div>
            )}

            <div className="border-t mt-auto pt-6">
              <Button
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                onClick={() => handlePayment(paymentMethod)}
                disabled={isProcessing || (paymentMethod === "Cash" && customerPaid < total)}
              >
                {paymentMethod === "Cash" ? "Xác nhận thanh toán" : "Đang chờ VNPAY..."}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}