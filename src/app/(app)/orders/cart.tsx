"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem } from "@/model/cart-item.model";

interface CartProps {
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function Cart({ 
  items, 
  onUpdateQty, 
  onRemoveItem, 
  onClearCart,
  onCheckout 
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.size.price * item.qty, 0);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="flex flex-col h-full ">
      <div className="p-4 border-b flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold">Giỏ hàng</h2>
          {items.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {totalItems} món
            </p>
          )}
        </div>
        {items.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearCart}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-thin ">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg 
              className="w-24 h-24 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <p className="text-lg font-medium">Giỏ hàng trống</p>
            <p className="text-sm mt-1">Thêm món vào giỏ hàng để bắt đầu</p>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="border p-3 hover:shadow-md transition-shadow bg-white rounded-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Size: {item.size.size} • {item.size.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold text-lg">
                    {item.qty}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="font-bold text-lg text-gray-800">
                  {(item.size.price * item.qty).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t px-4 space-y-3 shrink-0 ">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-semibold text-lg">
            {total.toLocaleString('vi-VN')}đ
          </span>
        </div>
        
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-gray-600">Giảm giá:</span>
          <span className="font-semibold text-green-600">0đ</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Tổng cộng:</span>
          <span className="font-bold text-2xl text-blue-600">
            {total.toLocaleString('vi-VN')}đ
          </span>
        </div>
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed" 
          size="lg" 
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
}