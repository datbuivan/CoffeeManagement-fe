"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderReturnView } from "@/model/order-return-view";

interface OrderListProps {
  orders: OrderReturnView[];
  selectedOrderId: string;
  onSelectOrder: (order: OrderReturnView) => void;
}

export default function OrderList({ orders, selectedOrderId, onSelectOrder }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <Card className="col-span-1 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Chọn Hóa Đơn</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Không có đơn hàng nào chưa giao
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Chọn Hóa Đơn</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {orders.map(order => (
            <Button
              key={order.id}
              variant={selectedOrderId === order.id ? "secondary" : "ghost"}
              className="w-full justify-between h-auto py-3 px-4"
              onClick={() => onSelectOrder(order)}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-semibold">
                  {order.table?.name || `Đơn #${order.id.slice(0, 8)}`}
                </span>
                <span className="text-xs text-muted-foreground">
                  {order.orderItems.length} món • {order.finalAmount?.toLocaleString('vi-VN') || '0'}đ
                </span>
              </div>
              {selectedOrderId === order.id && <Check className="h-5 w-5 text-primary" />}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}