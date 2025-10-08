"use client";

import ProductItem from "../products/ProductItem";
import { ProductSize } from "@/model/product-size.model";
import { Product } from "@/model/product.model";

export default function Menu({ selectedCategoryId, onAddToCart, products  }: { selectedCategoryId: string | null, onAddToCart: (product: Product, size: ProductSize) => void, products : Product[] }) {
  const filteredItems = selectedCategoryId
    ? products.filter((p) => p.categoryId === selectedCategoryId)
    : products;

  return (
    <div className="h-full overflow-y-auto space-y-3  p-1 bg-gradient-to-br from-[#F5F5DC] to-[#D2B48C] rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ProductItem
              key={item.id}
              product={item}
              onAdd={onAddToCart}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600 mt-10">Không có sản phẩm nào trong danh mục này.</p>
        )}
      </div>
    </div>
  );
}