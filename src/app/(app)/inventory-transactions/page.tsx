// app/inventory-transactions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import InventoryTransactionList from "./inventory-transaction-list";
import { inventoryTransactionService } from "@/services/inventory-transaction.service";
import { ingredientService } from "@/services/ingredient.service";
import { InventoryTransaction } from "@/model/inventory-transaction.model";
import { Ingredient } from "@/model/ingredient.model";

export default function InventoryTransactionsPage() {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all ingredients
  const loadIngredients = async () => {
    try {
      const res = await ingredientService.getAll();
      if (res.statusCode === 200 && res.data) {
        setIngredients(res.data);
      } else {
        console.error("Lỗi khi tải nguyên liệu:", res.message);
      }
    } catch (error) {
      console.error("Error loading ingredients:", error);
    }
  };

  // Load all transactions
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await inventoryTransactionService.getAll();
      if (res.statusCode === 200 && res.data) {
        setTransactions(res.data);
      } else {
        console.error("Lỗi khi tải giao dịch:", res.message);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const handleDelete = async (id: string) => {
    try {
      const res = await inventoryTransactionService.deleteById(id);
      if (res.statusCode === 200) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(res.message ?? "Không thể xóa giao dịch");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Có lỗi xảy ra khi xóa giao dịch!");
    }
  };

  useEffect(() => {
    loadIngredients();
    loadTransactions();
  }, []);

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pt-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadTransactions}
              className="border-[#D2B48C] text-[#6B4E31] hover:bg-[#EED6B3]/50 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tải lại giao dịch
            </Button>
          </div>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#D2B48C] border-t-[#6B4E31] rounded-full"
            />
            <p className="mt-4 text-[#6B4E31]/70">Đang tải giao dịch...</p>
          </div>
        ) : (
          <InventoryTransactionList
            transactions={transactions}
            ingredients={ingredients}
            onUpdate={loadTransactions}
            onDelete={handleDelete}
          />
        )}
      </div>
    </motion.div>
  );
}
