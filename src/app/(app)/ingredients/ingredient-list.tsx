// app/ingredients/ingredient-list.tsx
"use client";

import { useMemo, useState } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Pencil, Trash2, Search, AlertCircle, RefreshCw } from "lucide-react";
import { Ingredient } from "@/model/ingredient.model";
import IngredientForm from "./ingredient-form";

interface IngredientListProps {
  ingredients: Ingredient[];
  onUpdate: () => void;
  onDelete: (id: string) => void;
  loadAll?: () => Promise<void>; 
  loadLowStock?: () => Promise<void>; 
}

export default function IngredientList({
  ingredients,
  onUpdate,
  onDelete,
  loadAll,
  loadLowStock,
}: IngredientListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] =
    useState<Ingredient | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const perPage = 5;

  const filteredIngredients = useMemo(
    () =>
      ingredients.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [ingredients, searchQuery]
  );

  const totalPages = Math.ceil(filteredIngredients.length / perPage);
  const paginatedIngredients = useMemo(
    () =>
      filteredIngredients.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
      ),
    [filteredIngredients, currentPage, perPage]
  );

  const lowStockCount = useMemo(
    () =>
      ingredients.filter(
        (item) =>
          item.currentStock !== undefined &&
          item.currentStock <= item.reorderLevel
      ).length,
    [ingredients]
  );

  const handleAdd = () => {
    setEditingIngredient(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) {
      onDelete(id);
    }
  };

  const handleSaveSuccess = () => {
    setIsSheetOpen(false);
    setEditingIngredient(null);
    setCurrentPage(1);
    onUpdate();
  };

  const needsReorder = (ingredient: Ingredient) => {
    return (
      ingredient.currentStock !== undefined &&
      ingredient.currentStock <= ingredient.reorderLevel
    );
  };

  const toggleLowStockFilter = async () => {
    setShowLowStockOnly(!showLowStockOnly);
    setCurrentPage(1);
    if (!showLowStockOnly) {
      if (loadLowStock) await loadLowStock();
    } else {
      if (loadAll) await loadAll();
    }
  };

  const handleRefresh = async () => {
    if (showLowStockOnly) {
      if (loadLowStock) await loadLowStock();
    } else {
      if (loadAll) await loadAll();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: easeOut },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: i * 0.05 },
    }),
  };

  const paginationVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.05 },
    },
  };

  const paginationItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Header với tìm kiếm và nút thêm */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="relative max-w-md w-full">
          <motion.div whileHover={{ scale: 1.01 }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4E31]/50 h-4 w-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm nguyên liệu..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 border-[#D2B48C] focus:border-[#6B4E31] bg-[#FAF9F6] text-[#6B4E31]"
            />
          </motion.div>
        </div>
        <div className="flex gap-2 flex-wrap">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleAdd}
                className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31] font-medium shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm nguyên liệu
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={showLowStockOnly ? "default" : "outline"}
                onClick={toggleLowStockFilter}
                className={
                  showLowStockOnly
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "border-[#D2B48C] text-[#6B4E31] hover:bg-[#EED6B3]/50"
                }
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                {showLowStockOnly ? "Hiện tất cả" : "Chỉ tồn kho thấp"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-[#D2B48C] text-[#6B4E31] hover:bg-[#EED6B3]/50"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
      </motion.div>

      {lowStockCount > 0 && (
        <motion.div
            variants={itemVariants}
            className="bg-orange-50 border border-orange-200 rounded-md px-3 py-1 flex items-center gap-2 text-sm"
        >
            <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
            <span className="text-orange-900 font-medium">
            Có <span className="font-semibold">{lowStockCount}</span> nguyên liệu cần đặt hàng
            </span>
        </motion.div>
        )}



      {/* Bảng danh sách */}
      <motion.div variants={itemVariants}>
        <div className="bg-[#FAF9F6] rounded-xl shadow-sm overflow-hidden border border-[#D2B48C]/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] border-b border-[#D2B48C]/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider w-20">
                    STT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">
                    Tên nguyên liệu
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">
                    Đơn vị
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">
                    Mức đặt lại
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B4E31] uppercase tracking-wider w-32">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2B48C]/10">
                {paginatedIngredients.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#EED6B3]/10"
                  >
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-[#6B4E31]/50"
                    >
                      Không tìm thấy nguyên liệu nào
                    </td>
                  </motion.tr>
                ) : (
                  paginatedIngredients.map((ingredient, index) => (
                    <motion.tr
                      key={ingredient.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      className={`hover:bg-[#EED6B3]/20 transition-colors duration-200 ${
                        needsReorder(ingredient) ? "bg-orange-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#6B4E31]">
                        {(currentPage - 1) * perPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#6B4E31]">
                        {ingredient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-[#6B4E31]">
                        {ingredient.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-[#6B4E31]">
                        {ingredient.currentStock !== undefined
                          ? ingredient.currentStock.toLocaleString("vi-VN")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#6B4E31]/70">
                        {ingredient.reorderLevel.toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {ingredient.currentStock === undefined ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Chưa cập nhật
                          </span>
                        ) : needsReorder(ingredient) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Cần đặt hàng
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Đủ hàng
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(ingredient)}
                              className="text-[#6B4E31] hover:bg-[#EED6B3]/50 hover:text-[#6B4E31]"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(ingredient.id)}
                              className="text-red-600 hover:bg-red-50/50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={paginationVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center px-2"
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                >
                  <motion.span
                    variants={paginationItemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Previous
                  </motion.span>
                </PaginationPrevious>
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                    className="data-[state=active]:bg-[#D2B48C] data-[state=active]:text-white data-[state=active]:shadow-[#D2B48C]/50 hover:bg-[#EED6B3] text-[#6B4E31]"
                  >
                    <motion.span
                      variants={paginationItemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {i + 1}
                    </motion.span>
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  <motion.span
                    variants={paginationItemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                  </motion.span>
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}

      {/* Thống kê */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-4 text-sm text-[#6B4E31]/70"
      >
        <div>
          Tổng số:{" "}
          <span className="font-semibold text-[#6B4E31]">
            {ingredients.length}
          </span>{" "}
          nguyên liệu
        </div>
        {lowStockCount > 0 && (
          <div className="text-orange-600">
            Cần đặt hàng:{" "}
            <span className="font-semibold">{lowStockCount}</span> nguyên liệu
          </div>
        )}
      </motion.div>

      {/* Sheet Form */}
      <IngredientForm
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        ingredient={editingIngredient}
        onSuccess={handleSaveSuccess}
      />
    </motion.div>
  );
}