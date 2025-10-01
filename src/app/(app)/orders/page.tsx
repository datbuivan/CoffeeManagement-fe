"use client";

import { useState } from "react";
import Cart from "./Cart";
import Menu from "./Menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemReturnView from "./ItemReturnView";
import { CartItem } from "@/model/cart-item.model";


export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (item: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleUpdateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
      <Tabs defaultValue="order" className="w-full h-full flex flex-col p-6">
      <TabsList className="shrink-0 w-fit self-start -ml-6 -mt-6  rounded-none p-1 bg-stone-200"> 
        <TabsTrigger
          value="order"
          className="rounded-none px-6 h-12 text-sm font-semibold 
                     bg-muted text-muted-foreground
                     data-[state=active]:bg-[#6B4E31] 
                     data-[state=active]:text-white"
        >
          Đặt món
        </TabsTrigger>
        <TabsTrigger
          value="return"
          className="rounded-none  px-6 h-12 text-sm font-semibold
                     bg-muted text-muted-foreground
                     data-[state=active]:bg-[#6B4E31] 
                     data-[state=active]:text-white"
        >
          Trả món
        </TabsTrigger>
      </TabsList>

      <TabsContent value="order" className="flex-1 overflow-hidden mt-2">
        <div className="flex h-full flex-col md:flex-row">
          <div className="flex-1 border-r px-4 overflow-hidden">
            <Menu onAddToCart={handleAddToCart} />
          </div>
          <div className="w-full md:w-[400px] shrink-0">
            <Cart
              items={cart}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="return" className="flex-1 overflow-y-auto mt-2 p-4">
        <ItemReturnView />
      </TabsContent>
    </Tabs>
  );
}
