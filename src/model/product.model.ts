import { Category } from "./category.model";
import { ProductSize } from "./product-size.model";

export interface Product {
  id: string;
  name: string;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
  productSize?: ProductSize[];
}
