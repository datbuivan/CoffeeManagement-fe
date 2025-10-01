"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem } from "@/model/cart-item.model";

export default function Cart({ items, onUpdateQty, onRemoveItem,
  onClearCart, }: { items: CartItem[]; onUpdateQty: (id: number, delta: number) => void;onRemoveItem: (id: number) => void;
  onClearCart: () => void; }) {
  const router = useRouter(); 
  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleGoToCheckout = () => {
    // Lưu giỏ hàng hiện tại vào bộ nhớ trình duyệt
    localStorage.setItem('cart', JSON.stringify(items));
    // Chuyển người dùng đến trang checkout
    router.push('/checkout');
  };

  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C]">
      <CardHeader className="pb-2 border-b border-gray-700">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
        🛒 Giỏ hàng
        </CardTitle>
    </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-3 scroll-thin pr-2">
        {items.length === 0 && <p className="text-gray-500">Chưa có sản phẩm</p>}
        {items.map((item) => (
    <div
        key={item.id}
        className="flex justify-between items-center border-b pb-2"
    >
        <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-500">
            {item.qty} x {item.price.toLocaleString()} đ
        </p>
        <p className="text-sm font-semibold text-gray-700">
            = {(item.qty * item.price).toLocaleString()} đ
        </p>
        </div>
        <div className="flex gap-2">
        <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQty(item.id, -1)}
        >
            -
        </Button>
        <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQty(item.id, +1)}
        >
            +
        </Button>

        <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemoveItem(item.id)}
              >
                Xoá
              </Button>
        </div>
  </div>
))}

      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4 border-t pt-4">
        <div className="w-full flex justify-between items-center">
            <span className="text-muted-foreground">Tổng cộng:</span>
            <p className="font-semibold text-xl">{total.toLocaleString()} đ</p>
        </div>
        
        <div className="w-full flex gap-2">
          <Button
            className="w-1/3"
            variant="outline"
            onClick={onClearCart}
            disabled={items.length === 0}
          >
            Hủy
          </Button>

          <Button
            className="flex-1"
            disabled={items.length === 0}
            onClick={handleGoToCheckout}
          >
            Thanh toán
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
