// app/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductList from "./product-list";
import { Product } from "@/model/product.model";
import { Category } from "@/model/category.model";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { toast } from "sonner";
import { productSizeService } from "@/services/product-size.service";

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
      if (productRes.statusCode !== 200 || !productRes.data) {
        toast.error("Không thể tải sản phẩm");
        return;
      }
      const productsData: Product[] = productRes.data;
      const categoriesData: Category[] = categoryRes.statusCode === 200 ? categoryRes.data : [];
      
      const categoryMap = new Map(categoriesData.map(c => [c.id, c]));

      const productsWithDetails = await Promise.all(
        productsData.map(async (product) => {
          const sizesRes = await productSizeService.getByProductId(product.id);
          
          return {
            ...product,
            productSize: sizesRes.statusCode === 200 ? sizesRes.data : [],
            category: categoryMap.get(product.categoryId) // Lấy category object trực tiếp thay vì filter
          };
        })
      );
      setProducts(productsWithDetails);
      setCategories(categoriesData);

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
        toast.success("Xoá sản phẩm thành công");
      } else {
        toast.error(res.message ?? "Không thể xóa sản phẩm");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm!");
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
        
          <ProductList
            products={products}
            categories={categories}
            onUpdate={loadData}
            onDelete={handleDelete}
          />

      </div>
    </motion.div>
  );
}
