// app/products/product-list.tsx
"use client";

import { useState, useMemo } from "react";
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
import ProductForm from "./product-form";
import { Product } from "@/model/product.model";
import { Category } from "@/model/category.model";
import { productService } from "@/services/product.service";

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onUpdate: () => void;
  onDelete: (id: string) => void;
  
}

export default function ProductList({ products, categories, onUpdate }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const perPage = 5;

  // Lọc sản phẩm theo search
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  // Paginate dữ liệu
  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
      ),
    [filteredProducts, currentPage, perPage]
  );

  const totalPages = Math.ceil(filteredProducts.length / perPage);

  // Thêm mới
  const handleAdd = () => {
    setEditingProduct(null);
    setIsSheetOpen(true);
  };

  // Sửa
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsSheetOpen(true);
  };

  // Xóa
  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      await productService.deleteById(id);
      onUpdate();
    }
  };

  // Lưu xong refresh
  const handleSaveSuccess = () => {
    setIsSheetOpen(false);
    setEditingProduct(null);
    setCurrentPage(1);
    onUpdate();
  };

  // Animation setup
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: easeOut } },
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (!products.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-[#6B4E31]/60 italic"
      >
        Chưa có sản phẩm nào trong hệ thống.
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Thanh tìm kiếm + thêm */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4E31]/50 h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm sản phẩm theo tên hoặc danh mục..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 border-[#D2B48C] focus:border-[#6B4E31] bg-[#FAF9F6] text-[#6B4E31]"
          />
        </div>

        <Button
          onClick={handleAdd}
          className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31] font-medium shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </motion.div>

      {/* Bảng hiển thị sản phẩm */}
      <motion.div variants={itemVariants}>
        <div className="bg-[#FAF9F6] rounded-xl shadow-sm overflow-hidden border border-[#D2B48C]/20">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] border-b border-[#D2B48C]/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider w-12">
                  STT
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">
                  Kích cỡ
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider w-28">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B4E31] uppercase tracking-wider w-28">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D2B48C]/10">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6B4E31]/50">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p, index) => (
                  <motion.tr
                    key={p.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="hover:bg-[#EED6B3]/20 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-[#6B4E31] font-medium">
                      {(currentPage - 1) * perPage + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#6B4E31]">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B4E31]/80">
                      {p.category?.[0]?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B4E31]/80">
                      {p.productSize?.map((s) => s.name).join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {p.isAvailable ? (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50">
                          Đang bán
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50">
                          Ngừng bán
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(p)}
                          className="text-[#6B4E31] hover:bg-[#EED6B3]/50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:bg-red-50/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
          className="flex justify-center"
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                    className="data-[state=active]:bg-[#D2B48C] data-[state=active]:text-white hover:bg-[#EED6B3] text-[#6B4E31]"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}

      {/* Thống kê */}
      <motion.div variants={itemVariants} className="text-sm text-[#6B4E31]/70">
        Tổng số: <span className="font-semibold text-[#6B4E31]">{products.length}</span> sản phẩm
      </motion.div>

      {/* Sheet Form */}
      <ProductForm
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        product={editingProduct}
        categories={categories}
        onSuccess={handleSaveSuccess}
      />
    </motion.div>
  );
}
