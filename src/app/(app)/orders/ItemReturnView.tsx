"use client";

import { useState } from "react";
import OrderList, { Order } from "./OrderList";
import OrderDetail from "./OrderDetail";

const mockOrders: Order[] = [
  { id: "order-001", name: "Tầng 1 - 012", totalItems: 9, items: [ /* ... item data ... */ ] },
  { id: "order-002", name: "Tầng 1 - 004", totalItems: 8, items: [ /* ... item data ... */ ] },
  { id: "order-003", name: "Tầng 2 - 008", totalItems: 3, items: [ /* ... item data ... */ ] },
];

export default function ItemReturnView() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(mockOrders[0]);
  const [itemsToReturn, setItemsToReturn] = useState<Set<string>>(
    new Set(mockOrders[0].items.map((item) => item.id))
  );

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setItemsToReturn(new Set(order.items.map((item) => item.id)));
  };

  const toggleReturnItem = (itemId: string) => {
    setItemsToReturn((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) newSet.delete(itemId);
      else newSet.add(itemId);
      return newSet;
    });
  };

  const handleReturn = () => {
    if (!selectedOrder) return;
    console.log("Returning items for order:", selectedOrder.id);
    console.log("Items to return:", Array.from(itemsToReturn));
    // Logic gọi API sẽ ở đây
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-full font-sans">
      <OrderList
        orders={mockOrders}
        selectedOrderId={selectedOrder?.id || ""}
        onSelectOrder={handleSelectOrder}
      />
      <OrderDetail
        order={selectedOrder}
        itemsToReturn={itemsToReturn}
        onToggleItem={toggleReturnItem}
        onReturnSubmit={handleReturn}
      />
    </div>
  );
}