import { OrderItemResult } from "./oder-item-result";
import { Table } from "./table.model";

export interface OrderReturnView {
  id: string;
  tableId?: string;
  userId?: string;
  status?: string;
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  table?: Table;
  orderItems: OrderItemResult[];
}
