"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Order } from "./OrderList";

interface OrderDetailProps {
  order: Order | null;
  itemsToReturn: Set<string>;
  onToggleItem: (itemId: string) => void;
  onReturnSubmit: () => void;
}

export default function OrderDetail({ order, itemsToReturn, onToggleItem, onReturnSubmit }: OrderDetailProps) {
  if (!order) {
    return (
      <div className="md:col-span-2 bg-[#FDFBF6] rounded-lg border p-6 flex items-center justify-center">
        <p className="text-gray-500">Vui lòng chọn một order để xem chi tiết.</p>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 bg-[#FDFBF6] rounded-lg border p-6 relative">
      <h2 className="text-lg font-bold mb-6">1.1 - {order.name.replace(" - ", "/")}</h2>
      <div className="space-y-4">
        {order.items.map((item) => {
          const isSelected = itemsToReturn.has(item.id);
          return (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-gray-700">{item.name}</span>
              <div className="flex items-center gap-8">
                <span className="w-4 text-center font-semibold text-gray-800">{item.quantity}</span>
                <CheckCircle2
                  onClick={() => onToggleItem(item.id)}
                  className={cn(
                    "h-6 w-6 cursor-pointer",
                    isSelected ? "text-green-600 fill-green-100" : "text-gray-300"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-6 right-6">
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-24 w-24 rounded-lg border-2 border-green-600 text-green-600 gap-1"
          onClick={onReturnSubmit}
          disabled={itemsToReturn.size === 0} 
        >
          <CheckCircle2 className="h-8 w-8" />
          <span className="font-bold">
            Trả {itemsToReturn.size > 0 ? `(${itemsToReturn.size})` : ''} món
          </span>
        </Button>
      </div>
    </div>
  );
}