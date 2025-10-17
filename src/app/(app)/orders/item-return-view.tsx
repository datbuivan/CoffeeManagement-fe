"use client";

import { useState, useEffect } from "react";
import OrderList from "./order-list";
import OrderDetail from "./order-detail";
import { toast } from "sonner";
import { orderItemService } from "@/services/order-item.service";
import { productService } from "@/services/product.service";
import { productSizeService } from "@/services/product-size.service";
import { orderService } from "@/services/order.service";
import { OrderItemResult } from "@/model/oder-item-result";
import { OrderReturnView } from "@/model/order-return-view";

export default function ItemReturnView() {
  const [orders, setOrders] = useState<OrderReturnView[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderReturnView | null>(null);
  const [itemsToReturn, setItemsToReturn] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const enrichOrderItems = async (items: OrderItemResult[]): Promise<OrderReturnView[]> => {
    try {
      // Lấy danh sách unique IDs
      const orderIds = [...new Set(items.map(item => item.orderId))];
      const productIds = [...new Set(items.map(item => item.productId))];
      const productSizeIds = [...new Set(items.map(item => item.productSizeId))];

      // Gọi API song song
      const [ordersData, productsData, productSizesData] = await Promise.all([
        Promise.all(orderIds.map(id => orderService.getById(id))),
        Promise.all(productIds.map(id => productService.getById(id))),
        Promise.all(productSizeIds.map(id => productSizeService.getById(id)))
      ]);

      // Tạo lookup maps
      const orderMap = new Map(ordersData.map(res => [res.data.id, res.data]));
      const productMap = new Map(productsData.map(res => [res.data.id, res.data]));
      const productSizeMap = new Map(productSizesData.map(res => [res.data.id, res.data]));

      // Group items theo orderId
      const grouped: Record<string, OrderReturnView> = {};

      items.forEach(item => {
        if (!grouped[item.orderId]) {
          const orderData = orderMap.get(item.orderId);
          grouped[item.orderId] = {
            id: item.orderId,
            tableId: orderData?.tableId,
            userId: orderData?.userId,
            status: orderData?.status,
            totalAmount: orderData?.totalAmount,
            discountAmount: orderData?.discountAmount,
            finalAmount: orderData?.finalAmount,
            table: orderData?.table,
            orderItems: []
          };
        }

        const product = productMap.get(item.productId);
        const productSize = productSizeMap.get(item.productSizeId);

        const enrichedItem: OrderItemResult = {
          ...item,
          productName: product?.name || "Unknown Product",
          productSizeName: productSize?.size || "Unknown Size"
        };

        grouped[item.orderId].orderItems.push(enrichedItem);
      });

      return Object.values(grouped);
    } catch (error) {
      console.error("Error enriching order items:", error);
      throw error;
    }
  };

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const res = await orderItemService.getPendingOrderItems();
      
      if (res.data && res.data.length > 0) {
        const enrichedOrders = await enrichOrderItems(res.data);
        
        setOrders(enrichedOrders);
        setSelectedOrder(enrichedOrders[0] || null);
        setItemsToReturn(new Set(enrichedOrders[0]?.orderItems.map(i => i.id) || []));
      } else {
        setOrders([]);
        setSelectedOrder(null);
        setItemsToReturn(new Set());
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách đơn hàng chưa giao.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const handleSelectOrder = (order: OrderReturnView) => {
    setSelectedOrder(order);
    setItemsToReturn(new Set(order.orderItems.map(i => i.id)));
  };

  const toggleReturnItem = (itemId: string) => {
    setItemsToReturn(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) newSet.delete(itemId);
      else newSet.add(itemId);
      return newSet;
    });
  };

  const handleReturn = async () => {
    if (!selectedOrder || itemsToReturn.size === 0) {
      toast.error("Vui lòng chọn ít nhất một món để trả.");
      return;
    }

    try {
      const res = await orderItemService.updateIsDeliverOrders({
        ids: Array.from(itemsToReturn),
        isDeliver: true
      });

      toast.success(`Đã trả ${res.data} món từ bàn ${selectedOrder.table?.name || selectedOrder.id}`);
      
      // Refresh lại danh sách
      await fetchPendingOrders();
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi trả món.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 h-full w-full rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full w-full rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full font-sans">
        <OrderList
          orders={orders}
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
    </div>
  );
}