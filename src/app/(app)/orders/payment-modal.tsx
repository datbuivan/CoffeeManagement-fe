"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { User } from "lucide-react";
import { CartItem } from "@/model/cart-item.model";
import { Table } from "@/model/table.model";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  selectedTable: Table | null;
  onConfirmPayment: (paymentMethod: string, customerPaid: number) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  cart,
  selectedTable,
  onConfirmPayment,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerPaid, setCustomerPaid] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.size.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const quickAmounts = [10000, 20000, 50000, 100000, 200000, 500000];
  const change = customerPaid - total;

  useEffect(() => {
    if (isOpen) {
      setCustomerPaid(0);
      setPaymentMethod("cash");
      setPaymentUrl(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (paymentMethod === "cash") {
      if (customerPaid < total) {
        alert("Số tiền khách trả chưa đủ!");
        return;
      }
      onConfirmPayment("cash", customerPaid);
      return;
    }

    // --- Thanh toán VNPAY (fake QR khi chưa có API) ---
    try {
      // const res = await fetch("/api/order", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     tableId: selectedTable?.id || null,
      //     paymentMethod: "vnpay",
      //     items: cart.map((item) => ({
      //       productId: item.product.id,
      //       sizeId: item.size.id,
      //       quantity: item.qty,
      //     })),
      //   }),
      // });

      // const data = await res.json();
      // if (data?.data?.paymentUrl) {
      //   setPaymentUrl(data.data.paymentUrl);
      // } else {
      //   alert("Không lấy được liên kết thanh toán!");
      // }
      setIsProcessing(true);

      // 🔹 Giả lập thời gian chờ gọi API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 🔹 Fake link thanh toán sandbox VNPAY (demo)
      const fakePaymentUrl =
        "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2900000&vnp_Command=pay&vnp_CreateDate=20251006162603&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+50cc1613-ced7-4f9e-b533-08de04ba5e6b&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Flocalhost%3A7200%2Fapi%2FOrder%2Fvnpay-return&vnp_TmnCode=3LPCLU5B&vnp_TxnRef=50cc1613-ced7-4f9e-b533-08de04ba5e6b&vnp_Version=2.1.0&vnp_SecureHash=9ad7888091e165e4c9b1f8a7d3dce4c7cee375ba95688b587abea8cc13e28429de0483cdec20a94b1a5e04405855cdf2442d6e4026d59048659887db74815ca0";

      // Hoặc nếu muốn hiển thị QR code tĩnh:
      // const fakePaymentUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ThanhToanFake_${Date.now()}`;

      setPaymentUrl(fakePaymentUrl);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo thanh toán (fake)!");
    } finally {
      setIsProcessing(false);
    }
 };

  useEffect(() => {
    if (isOpen && paymentMethod === "transfer" && !paymentUrl && !isProcessing) {
      handlePayment(); // tự gọi hàm tạo QR
    }
  }, [isOpen, paymentMethod]);


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
                    {selectedTable ? `Thanh toán #${selectedTable.id}` : "Thanh toán"}
                  </SheetTitle>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedTable ? selectedTable.name : "Mang về"}
                  </div>
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
              onValueChange={setPaymentMethod}
              className="flex gap-6 mb-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Tiền mặt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer">Chuyển khoản (VNPAY)</Label>
              </div>
            </RadioGroup>

            {paymentMethod === "cash" && (
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
                      onClick={() => setCustomerPaid(amount)}
                      className="h-12 text-sm font-semibold hover:bg-blue-50"
                    >
                      {amount.toLocaleString("vi-VN")}
                    </Button>
                  ))}
                </div>
              </>
            )}

            {paymentMethod === "transfer" && (
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

            <div className="border-t pt-6 mt-6">
              <Button
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                onClick={() => {
                  if (paymentMethod === "cash") handlePayment();
                }}
                disabled={paymentMethod === "cash" && customerPaid < total}
              >
                {paymentMethod === "cash" ? "Xác nhận thanh toán" : "Đang chờ VNPAY..."}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
