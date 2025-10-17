import { ApiResponse } from "@/model/api-response.model";
import BaseService from "./base.service";
import { BulkUpdateOrderItemRequest } from "@/model/bulk-update-order-item.model";
import { OrderItemResult } from "@/model/oder-item-result";

class OrderItemService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getPendingOrderItems(): Promise<ApiResponse<OrderItemResult[]>> {
    return this.get<OrderItemResult[]>(`/orderitems/pending`);
  }

  async updateIsDeliverOrder(
    orderItemId: string,
    isDeliver: boolean
  ): Promise<ApiResponse<boolean>> {
    return this.patch<boolean, boolean>(
      `/orderitems/${orderItemId}/deliver`,
      isDeliver
    );
  }

  async updateIsDeliverOrders(
    body: BulkUpdateOrderItemRequest
  ): Promise<ApiResponse<number>> {
    return this.patch<number, BulkUpdateOrderItemRequest>(
      `/orderitems/bulk-deliver`,
      body
    );
  }
}

export const orderItemService = new OrderItemService();
