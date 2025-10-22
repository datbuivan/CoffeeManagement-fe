"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderItemResult } from "@/model/oder-item-result";
import { OrderReturnView } from "@/model/order-return-view";

interface OrderDetailProps {
  order: OrderReturnView | null;
  itemsToReturn: Set<string>;
  onToggleItem: (itemId: string) => void;
  onReturnSubmit: () => void;
}

export default function OrderDetail({
  order,
  itemsToReturn,
  onToggleItem,
  onReturnSubmit
}: OrderDetailProps) {
  if (!order) {
    return (
      <Card className="col-span-2 h-full flex items-center justify-center">
        <p className="text-muted-foreground">Chọn một hóa đơn để xem chi tiết</p>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 h-full flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">
          Chi tiết hóa đơn: {order.table?.name || `#${order.id.slice(0, 8)}`}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col p-0 min-h-[450px]">
        {/* Scrollable Items List */}
        <div className="flex-grow overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {order.orderItems.map((item: OrderItemResult) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50 transition-colors"
              >
                <label htmlFor={item.id} className="flex items-center gap-3 cursor-pointer flex-1">
                  <Checkbox
                    id={item.id}
                    checked={itemsToReturn.has(item.id)}
                    onCheckedChange={() => onToggleItem(item.id)}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">
                      {item.productName || "Unknown Product"}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Size: {item.productSizeName || "N/A"}</span>
                      <span>•</span>
                      <span>SL: {item.quantity}</span>
                      <span>•</span>
                      <span>{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                </label>
                <span className="font-semibold text-right ml-2">
                  {item.subTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Fixed Button at Bottom */}
        <div className="mt-auto border-t bg-gray-50 px-6 py-4">
          <Button
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={onReturnSubmit}
            disabled={itemsToReturn.size === 0}
          >
            Trả {itemsToReturn.size} món đã chọn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}