// app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast  } from "sonner";
import { PromotionPanel } from "./PromotionPanel";
import { InvoicePanel } from "./InvoicePanel";
import { PaymentActions } from "./PaymentActions";
import { CartItem } from "@/model/cart-item.model";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [appliedPromoId, setAppliedPromoId] = useState<string | null>(null); // Thêm state này
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const finalTotal = subtotal - discount;

  const handleApplyPromotion = (discountAmount: number, promoId: string | null) => {
    setDiscount(discountAmount);
    setAppliedPromoId(promoId); // Cập nhật ID khuyến mãi đã áp dụng
  };

  const handlePaymentSuccess = () => {
    console.log("Thanh toán thành công!");
    
    toast.success("Thanh toán thành công!", {
      description: "Đơn hàng của bạn đã được xử lý.",
    });

    localStorage.removeItem('cart');

    setTimeout(() => {
      router.push('/orders');
    }, 2000);
  };

  return (
    // Áp dụng gradient cho div này và làm cho nó full screen
    <div className="h-full bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full"> {/* h-full cho container chính */}
        <div className="lg:col-span-1 h-full"> {/* h-full cho PromotionPanel */}
          <PromotionPanel 
            subtotal={subtotal} 
            onApplyPromotion={handleApplyPromotion} 
            appliedPromoId={appliedPromoId}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col h-full"> {/* flex-col h-full cho InvoicePanel và các nút */}
          <InvoicePanel 
            items={cartItems}
            subtotal={subtotal}
            discount={discount}
          />
          <PaymentActions 
            finalTotal={finalTotal}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    </div>
  );
}