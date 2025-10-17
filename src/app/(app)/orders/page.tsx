"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemReturnView from "./item-return-view";
import OrderViewPage from "./order-page";
export default function OrderPage() {
  const [activeTab, setActiveTab] = useState("order");

  return (
    <div className="p-4 h-full w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="mb-2">
          <TabsTrigger value="order">Tạo đơn</TabsTrigger>
          <TabsTrigger value="return">Trả món</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="order" className="h-full">
            <OrderViewPage />
          </TabsContent>

          <TabsContent value="return" className="h-full">
            <ItemReturnView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
