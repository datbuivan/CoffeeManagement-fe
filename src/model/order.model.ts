import { OrderItem } from "./order-item.model";
import { Table } from "./table.model";

export interface Order {
  id: string;
  tableId?: string;
  userId: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  table?: Table;
  orderItems: OrderItem[];
}
