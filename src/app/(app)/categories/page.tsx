"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CategoryList from "./category-list";
import { Category } from "@/model/category.model";
import { categoryService } from "@/services/category.service";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories từ API
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      console.log(response);
      if (response.statusCode === 200 && response.data) {
        setCategories(response.data);
      } else {
        console.error("Lỗi khi tải danh mục:", response.message);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa category
  const handleDelete = async (id: string) => {
    try {
      const res = await categoryService.deleteById(id);
      if (res.statusCode === 200) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } else {
        alert(res.message ?? "Không thể xóa danh mục");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Có lỗi xảy ra khi xóa danh mục!");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Animation variants
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
          <div className="text-center text-gray-500">Đang tải danh mục...</div>
        ) : (
          <CategoryList
            categories={categories}
            onUpdate={loadCategories}
            onDelete={handleDelete}
            
          />
        )}
      </div>
    </motion.div>
  );
}
