// app/inventory-transactions/inventory-transaction-list.tsx
"use client";

import { useMemo, useState } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
} from "lucide-react";
import InventoryTransactionForm from "./inventory-transaction-form";
import { InventoryTransaction } from "@/model/inventory-transaction.model";
import { Ingredient } from "@/model/ingredient.model";

interface InventoryTransactionListProps {
  transactions: InventoryTransaction[];
  ingredients: Ingredient[];
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

const TRANSACTION_TYPES = [
  { value: "ALL", label: "Tất cả", color: "", bgColor: "" },
  { value: "IN", label: "Nhập kho", color: "text-green-600", bgColor: "bg-green-100" },
  { value: "OUT", label: "Xuất kho", color: "text-red-600", bgColor: "bg-red-100" },
  { value: "ADJUST", label: "Điều chỉnh", color: "text-blue-600", bgColor: "bg-blue-100" },
];

export default function InventoryTransactionList({
  transactions,
  ingredients,
  onUpdate,
  onDelete,
}: InventoryTransactionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<InventoryTransaction | null>(null);

  const perPage = 10;

  // Lấy tên nguyên liệu
  const getIngredientName = (id: string) => {
    const ing = ingredients.find((i) => i.id === id);
    return ing ? ing.name : "N/A";
  };

  // Lấy đơn vị nguyên liệu
  const getIngredientUnit = (id: string) => {
    const ing = ingredients.find((i) => i.id === id);
    return ing ? ing.unit : "";
  };

  // Lọc transactions theo search & type
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        getIngredientName(t.ingredientId).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.relatedDocumentId?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === "ALL" || t.transactionType === filterType;
      return matchSearch && matchType;
    });
  }, [transactions, searchQuery, filterType, ingredients]);

  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTransactions = useMemo(
    () =>
      filteredTransactions.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
      ),
    [filteredTransactions, currentPage, perPage]
  );

  // Thống kê
  const statistics = useMemo(() => {
    const totalIn = transactions
      .filter((t) => t.transactionType === "IN")
      .reduce((sum, t) => sum + t.quantity, 0);
    const totalOut = transactions
      .filter((t) => t.transactionType === "OUT")
      .reduce((sum, t) => sum + t.quantity, 0);
    const totalValue = transactions
      .reduce((sum, t) => sum + (t.unitPrice ? t.quantity * t.unitPrice : 0), 0);
    return { totalIn, totalOut, totalValue };
  }, [transactions]);

  // Mở sheet thêm mới
  const handleAdd = () => {
    setEditingTransaction(null);
    setIsSheetOpen(true);
  };

  // Mở sheet chỉnh sửa
  const handleEdit = (transaction: InventoryTransaction) => {
    setEditingTransaction(transaction);
    setIsSheetOpen(true);
  };

  // Xóa transaction
  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      onDelete(id);
    }
  };

  // Callback sau khi lưu thành công
  const handleSaveSuccess = () => {
    setIsSheetOpen(false);
    setEditingTransaction(null);
    setCurrentPage(1);
    onUpdate();
  };

  // Animation
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: easeOut } } };
  const rowVariants = { hidden: { opacity: 0, x: -10 }, visible: (i: number) => ({ opacity: 1, x: 0, transition: { duration: 0.3, delay: i * 0.05 } }) };
  const paginationVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.05 } } };
  const paginationItemVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };

  const getTypeDisplay = (type: string) => TRANSACTION_TYPES.find((t) => t.value === type) || { label: type, color: "", bgColor: "bg-gray-100" };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Thống kê */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-green-700">Tổng nhập kho</p>
            <p className="text-2xl font-bold text-green-900">{statistics.totalIn.toLocaleString("vi-VN")}</p>
          </div>
          <ArrowDown className="h-8 w-8 text-green-600" />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-red-700">Tổng xuất kho</p>
            <p className="text-2xl font-bold text-red-900">{statistics.totalOut.toLocaleString("vi-VN")}</p>
          </div>
          <ArrowUp className="h-8 w-8 text-red-600" />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-700">Tổng giá trị</p>
            <p className="text-2xl font-bold text-blue-900">{statistics.totalValue.toLocaleString("vi-VN")} đ</p>
          </div>
          <RefreshCw className="h-8 w-8 text-blue-600" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4E31]/50 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo nguyên liệu, mã CT..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10 border-[#D2B48C] focus:border-[#6B4E31] bg-[#FAF9F6] text-[#6B4E31]"
          />
        </div>

        <Select value={filterType} onValueChange={(value) => { setFilterType(value); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-48 border-[#D2B48C] focus:border-[#6B4E31] bg-[#FAF9F6]">
            <SelectValue placeholder="Lọc theo loại..." />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <span className={t.color}>{t.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleAdd} className="w-full sm:w-auto bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31] font-medium shadow-lg flex items-center gap-2">
          <Plus className="h-4 w-4" /> Tạo giao dịch
        </Button>
      </motion.div>

      {/* Bảng giao dịch */}
      <motion.div variants={itemVariants}>
        <div className="bg-[#FAF9F6] rounded-xl shadow-sm overflow-hidden border border-[#D2B48C]/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] border-b border-[#D2B48C]/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider w-20">STT</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">Nguyên liệu</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">Loại GD</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">Số lượng</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">Đơn giá</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">Thành tiền</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B4E31] uppercase tracking-wider">Mã CT</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B4E31] uppercase tracking-wider w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2B48C]/10">
                {paginatedTransactions.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#6B4E31]/50">Không tìm thấy giao dịch nào</td>
                  </motion.tr>
                ) : (
                  paginatedTransactions.map((t, i) => {
                    const typeDisplay = getTypeDisplay(t.transactionType);
                    const totalAmount = t.unitPrice ? t.quantity * t.unitPrice : 0;

                    return (
                      <motion.tr
                        key={t.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        className="hover:bg-[#EED6B3]/20 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#6B4E31]">{(currentPage-1)*perPage + i +1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#6B4E31]">{getIngredientName(t.ingredientId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeDisplay.bgColor} ${typeDisplay.color}`}>
                            {typeDisplay.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-[#6B4E31]">{t.quantity.toLocaleString("vi-VN")} {getIngredientUnit(t.ingredientId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#6B4E31]">{t.unitPrice ? t.unitPrice.toLocaleString("vi-VN")+" đ" : "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#6B4E31]">{totalAmount ? totalAmount.toLocaleString("vi-VN")+" đ" : "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B4E31]">{t.relatedDocumentId || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline" onClick={()=>handleEdit(t)}>Sửa</Button>
                          <Button size="sm" variant="destructive" onClick={()=>handleDelete(t.id)}>Xóa</Button>
                        </td>
                      </motion.tr>
                    );
                  })
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

      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-4 text-sm text-[#6B4E31]/70"
      >
        <div>
          Tổng số:{" "}
          <span className="font-semibold text-[#6B4E31]">
            {transactions.length}
          </span>{" "}
          hoá đơn
        </div>
      </motion.div>

      {/* Sheet Form */}
      {isSheetOpen && (
        <InventoryTransactionForm
          isOpen={isSheetOpen}
          transaction={editingTransaction}
          ingredients={ingredients}
          onClose={() => setIsSheetOpen(false)}
          onSuccess={handleSaveSuccess}
        />
      )}
    </motion.div>
  );
}
