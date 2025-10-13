import { Order } from "./order.model";
import { ProductSize } from "./product-size.model";
import { Product } from "./product.model";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productSizeId: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  order: Order;
  product: Product;
  productSize: ProductSize;
}
