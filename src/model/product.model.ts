import { ProductSize } from "./product-size.model";

export interface Product {
  id: number;
  name: string;
  categoryName: string;
  sizes: ProductSize[];
}
