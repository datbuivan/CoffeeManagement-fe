export interface OrderItemResult {
  id: string;
  orderId: string;
  productId: string;
  productSizeId: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  productName?: string;
  productSizeName?: string;
}
