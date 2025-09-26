// app/checkout/PromotionPanel.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// --- Dữ liệu giả lập ---
const promotions = [
  {
    id: "promo1",
    description: "Giảm giá 5% đơn trên 300K",
    minSpend: 300000,
    type: "percentage",
    value: 5, // 5%
  },
  {
    id: "promo2",
    description: "Giảm giá 8% đơn trên 450K",
    minSpend: 450000,
    type: "percentage",
    value: 8, // 8%
  },
  {
    id: "promo3",
    description: "Giảm giá 10% đơn trên 800K",
    minSpend: 800000,
    type: "percentage",
    value: 10, // 10%
  },
  {
    id: "promo4",
    description: "Giảm thẳng 20K cho đơn hàng",
    minSpend: 0,
    type: "fixed",
    value: 20000, // 20,000 VND
  },
];

interface PromotionPanelProps {
  subtotal: number;
  onApplyPromotion: (discountAmount: number, promoId: string | null) => void; // Thêm promoId để dễ quản lý
  appliedPromoId: string | null; // Để biết khuyến mãi nào đang được áp dụng
}

export function PromotionPanel({ subtotal, onApplyPromotion, appliedPromoId }: PromotionPanelProps) {
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(appliedPromoId);

  const handleApplyClick = () => {
    if (!selectedPromoId) {
      onApplyPromotion(0, null); // Không chọn gì thì không giảm
      return;
    }

    const selectedPromo = promotions.find(p => p.id === selectedPromoId);
    if (selectedPromo) {
      let discount = 0;
      if (selectedPromo.type === "percentage") {
        discount = (subtotal * selectedPromo.value) / 100;
      } else { // 'fixed'
        discount = selectedPromo.value;
      }
      onApplyPromotion(discount, selectedPromo.id);
    }
  };

  return (
    // Thay đổi màu nền, bỏ rounded-lg shadow-sm
    <div className="bg-[#f0e2d0] flex flex-col h-full overflow-hidden">
      {/* Header thay đổi màu sắc và text */}
      <h2 className="text-lg font-bold bg-[#D2766B] text-white p-4 text-center">
        🎁 Chương trình khuyến mãi
      </h2>
      <div className="space-y-0 flex-grow py-2"> {/* space-y-0 để các item sát nhau */}
        {promotions.map(promo => {
          const isEligible = subtotal >= promo.minSpend;
          const isSelected = selectedPromoId === promo.id;

          return (
            <div
              key={promo.id}
              onClick={() => isEligible && setSelectedPromoId(isSelected ? null : promo.id)}
              className={cn(
                "flex items-center space-x-4 p-4 transition-colors relative", // Relative cho viền
                isEligible ? "cursor-pointer hover:bg-white/50" : "opacity-50 cursor-not-allowed",
                isSelected && isEligible ? "bg-white border-l-4 border-[#6B4E31]" : "bg-transparent" // Viền bên trái khi chọn
              )}
            >
              <Checkbox
                checked={isSelected && isEligible}
                disabled={!isEligible}
                className="w-5 h-5" // Giảm kích thước checkbox
                id={`promo-${promo.id}`} // Thêm id cho label
              />
              <label htmlFor={`promo-${promo.id}`} className={cn("font-medium", !isEligible && "text-gray-500", "flex-1 cursor-pointer")}>
                {promo.description}
              </label>
            </div>
          );
        })}
      </div>
      <Button onClick={handleApplyClick} className="w-full bg-[#6B4E31] hover:bg-[#8a6f54] mt-auto rounded-none py-6">
        Áp dụng
      </Button>
    </div>
  );
}