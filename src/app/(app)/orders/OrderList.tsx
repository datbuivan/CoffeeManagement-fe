"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Order {
  id: string;
  name: string;
  totalItems: number;
  items: { id: string; name: string; quantity: number }[];
}

interface OrderListProps {
  orders: Order[];
  selectedOrderId: string;
  onSelectOrder: (order: Order) => void;
}

export default function OrderList({ orders, selectedOrderId, onSelectOrder }: OrderListProps) {
  return (
    <div className="md:col-span-1 bg-[#FDFBF6] rounded-lg border p-2 space-y-1">
      <div className="flex justify-between px-4 py-2 font-bold text-sm text-gray-600">
        <span>Bàn order</span>
        <span>Số lượng</span>
      </div>
      <div className="space-y-1">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className={cn(
              "flex justify-between items-center px-4 py-3 rounded-md cursor-pointer transition-colors duration-200",
              "hover:bg-[#EAE0D5]",
              selectedOrderId === order.id && "bg-[#9A8269] text-white"
            )}
          >
            <span className="font-semibold">{order.name}</span>
            <div className="flex items-center gap-4">
              <span className="font-bold">{order.totalItems}</span>
              {selectedOrderId === order.id && <Check className="h-5 w-5" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}