import { OrderItemCreate } from "./order-item-create.model";

export interface CreateOrder {
  userId: string;
  tableId?: string | null;
  items: OrderItemCreate[];
  paymentMethod: "Cash" | "VnPay";
  discountAmount?: number;
}
