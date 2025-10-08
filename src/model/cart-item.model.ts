import { ProductSize } from "./product-size.model";
import { Product } from "./product.model";

export interface CartItem {
  id: string;
  product: Product;
  size: ProductSize;
  qty: number;
}
