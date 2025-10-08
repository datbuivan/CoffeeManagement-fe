// app/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductList from "./product-list";
import { Product } from "@/model/product.model";
import { Category } from "@/model/category.model";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu sản phẩm & danh mục
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);

      if (productRes.statusCode === 200 && productRes.data) {
        setProducts(productRes.data);
      } else {
        console.error("Lỗi khi tải sản phẩm:", productRes.message);
      }

      if (categoryRes.statusCode === 200 && categoryRes.data) {
        setCategories(categoryRes.data);
      } else {
        console.error("Lỗi khi tải danh mục:", categoryRes.message);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (id: string) => {
    try {
      const res = await productService.deleteById(id);
      if (res.statusCode === 200) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(res.message ?? "Không thể xóa sản phẩm");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm!");
    }
  };

  // Animation page
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pt-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-500">
            Đang tải danh sách sản phẩm...
          </div>
        ) : (
          <ProductList
            products={products}
            categories={categories}
            onUpdate={loadData}
            onDelete={handleDelete}
          />
        )}
      </div>
    </motion.div>
  );
}
