// app/categories/category-list.tsx
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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import CategoryForm from "./category-form";
import { Category } from "@/model/category.model";


interface CategoryListProps {
  categories: Category[];
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

export default function CategoryList({ categories, onUpdate, onDelete }: CategoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const perPage = 5;

  const filteredCategories = useMemo(() => 
  categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  ),
  [categories, searchQuery]
);

  const totalPages = Math.ceil(filteredCategories.length / perPage);
  const paginatedCategories = useMemo(() => 
  filteredCategories.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  ),
  [filteredCategories, currentPage, perPage]
);

  // Mở sheet thêm mới
  const handleAdd = () => {
    setEditingCategory(null);
    setIsSheetOpen(true);
  };

  // Mở sheet chỉnh sửa
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsSheetOpen(true);
  };

  // Xóa category
  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      onDelete(id);
    }
  };

  // Callback sau khi lưu thành công
  const handleSaveSuccess = () => {
    setIsSheetOpen(false);
    setEditingCategory(null);
    setCurrentPage(1); // Reset to first page after save
    onUpdate();
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
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div className="relative max-w-md">
          <motion.div whileHover={{ scale: 1.01 }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4E31]/50 h-4 w-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-10 border-[#D2B48C] focus:border-[#6B4E31] bg-[#FAF9F6] text-[#6B4E31]"
            />
          </motion.div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={handleAdd} className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31] font-medium shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Button>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-[#FAF9F6] rounded-xl shadow-sm overflow-hidden border border-[#D2B48C]/20">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] border-b border-[#D2B48C]/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider w-20">
                  STT
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">
                  Tên danh mục
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B4E31] uppercase tracking-wider w-32">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D2B48C]/10">
              {paginatedCategories.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-[#EED6B3]/10"
                >
                  <td colSpan={4} className="px-6 py-12 text-center text-[#6B4E31]/50">
                    Không tìm thấy danh mục nào
                  </td>
                </motion.tr>
              ) : (
                paginatedCategories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="hover:bg-[#EED6B3]/20 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#6B4E31]">
                      {(currentPage - 1) * perPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#6B4E31]">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            className="text-[#6B4E31] hover:bg-[#EED6B3]/50 hover:text-[#6B4E31]"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
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
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
      <motion.div variants={itemVariants} className="text-sm text-[#6B4E31]/70">
        Tổng số: <span className="font-semibold text-[#6B4E31]">{categories.length}</span> danh mục
      </motion.div>

      {/* Sheet Form */}
      <CategoryForm
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        category={editingCategory}
        onSuccess={handleSaveSuccess}
      />
    </motion.div>
  );
}