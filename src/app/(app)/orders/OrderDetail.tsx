"use client";

import { Button } from "@/components/ui/button";
import { Order } from "./OrderList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@radix-ui/react-checkbox";


export default function OrderDetail({ order, itemsToReturn, onToggleItem, onReturnSubmit }: { order: Order | null, itemsToReturn: Set<string>, onToggleItem: (itemId: string) => void, onReturnSubmit: () => void }) {
  if (!order) {
    return (
      <Card className="col-span-2 h-full flex items-center justify-center">
        <p className="text-muted-foreground">Chọn một hóa đơn để xem chi tiết</p>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Chi tiết hóa đơn: {order.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
              <label htmlFor={item.id} className="flex items-center gap-4 cursor-pointer">
                <Checkbox
                  id={item.id}
                  checked={itemsToReturn.has(item.id)}
                  onCheckedChange={() => onToggleItem(item.id)}
                />
                <span className="font-medium">{item.name}</span>
              </label>
              <span className="text-muted-foreground">Số lượng: {item.quantity}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <Button 
          size="lg" 
          className="w-full bg-red-600 hover:bg-red-700" 
          onClick={onReturnSubmit}
          disabled={itemsToReturn.size === 0}
        >
          Trả {itemsToReturn.size} món đã chọn
        </Button>
      </div>
    </Card>
  );
}