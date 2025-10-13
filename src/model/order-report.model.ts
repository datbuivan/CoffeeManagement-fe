export interface OrderReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tableName?: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
}
