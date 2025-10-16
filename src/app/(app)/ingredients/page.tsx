// app/ingredients/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ingredient } from "@/model/ingredient.model";
import { ingredientService } from "@/services/ingredient.service";
import IngredientList from "./ingredient-list";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const response = await ingredientService.getAll();
      console.log(response);
      if (response.statusCode === 200 && response.data) {
        setIngredients(response.data);
      } else {
        console.error("Lỗi khi tải nguyên liệu:", response.message);
      }
    } catch (error) {
      console.error("Error loading ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLowStockIngredients = async () => {
    try {
      setLoading(true);
      const response = await ingredientService.lowStock();
      console.log(response);
      if (response.statusCode === 200 && response.data) {
        setIngredients(response.data);
      } else {
        console.error("Lỗi khi tải nguyên liệu:", response.message);
      }
    } catch (error) {
      console.error("Error loading low stock ingredients:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    try {
      const res = await ingredientService.deleteById(id);
      if (res.statusCode === 200) {
        setIngredients((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(res.message ?? "Không thể xóa nguyên liệu");
      }
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      alert("Có lỗi xảy ra khi xóa nguyên liệu!");
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

//   const headerVariants = {
//     hidden: { y: -20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.4 },
//     },
//   };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pt-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#D2B48C] border-t-[#6B4E31] rounded-full"
            />
            <p className="mt-4 text-[#6B4E31]/70">Đang tải nguyên liệu...</p>
          </div>
        ) : (
          <IngredientList
            ingredients={ingredients}
            onUpdate={loadIngredients}
            onDelete={handleDelete}
            loadAll={loadIngredients}
            loadLowStock={loadLowStockIngredients}
          />
        )}
      </div>
    </motion.div>
  );
}