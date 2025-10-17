import { ApiResponse } from "@/model/api-response.model";
import { CreateOrder } from "@/model/create-order.model";
import { Order } from "@/model/order.model";
import { VnPay } from "@/model/vnpay.model";
import BaseService from "./base.service";

class OrderService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getById(id: string): Promise<ApiResponse<Order>> {
    return this.get<Order>(`/Order/${id}`);
  }

  /** Tạo đơn hàng và thanh toán */
  async createAndPayOrder(
    dto: CreateOrder
  ): Promise<ApiResponse<Order | VnPay>> {
    return await this.post<Order | VnPay>("/Order", dto);
  }

  /** Callback từ VnPay */
  async handleVnPayReturn(
    query: URLSearchParams
  ): Promise<ApiResponse<unknown>> {
    return await this.get(`/vnpay-return?${query.toString()}`);
  }
}

export const orderService = new OrderService();
