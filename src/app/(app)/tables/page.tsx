// app/tables/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TableList from "./table-list";
import { Table } from "@/model/table.model";
import { tableService } from "@/services/table.service";


export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load tables từ service
  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await tableService.getAll();
      console.log(response);
      if (response.statusCode === 200 && response.data) {
        setTables(response.data);
      } else {
        console.error("Lỗi khi tải danh mục:", response.message);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa table
  const handleDelete = async (id: string) => {
    try {
      const res = await tableService.deleteById(id);
        if (res.statusCode === 200) {
          setTables((prev) => prev.filter((table) => table.id !== id));
        } else {
          alert(res.message ?? "Không thể xóa danh mục");
        }
    } catch (error) {
      console.error("Error deleting table:", error);
      alert("Có lỗi xảy ra khi xóa bàn!");
    }
  };

  // Animation variants for page
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
        <TableList
          tables={tables}
          onUpdate={loadTables}
          onDelete={handleDelete}
        />
      )}
      </div>
    </motion.div>
  );
}