"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  name: string;
  totalItems: number;
  items: OrderItem[];
}


export default function OrderList({ orders, selectedOrderId, onSelectOrder }: { orders: Order[], selectedOrderId: string, onSelectOrder: (order: Order) => void }) {
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
              className="w-full justify-between h-14"
              onClick={() => onSelectOrder(order)}
            >
              <span>{order.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{order.totalItems} món</span>
                {selectedOrderId === order.id && <Check className="h-5 w-5 text-primary" />}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}