// app/tables/table-form.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Table } from "@/model/table.model";
import { tableService } from "@/services/table.service";

interface TableFormProps {
  isOpen: boolean;
  onClose: () => void;
  table?: Table | null;
  onSuccess: () => void;
}

export default function TableForm({
  isOpen,
  onClose,
  table,
  onSuccess,
}: TableFormProps) {
  const [formData, setFormData] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form khi mở/đóng hoặc table thay đổi
  useEffect(() => {
    if (isOpen) {
      if (table) {
        setFormData({ name: table.name});
      } else {
        setFormData({ name: "" });
      }
      setErrors({});
    }
  }, [isOpen, table]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên bàn không được để trống";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên bàn phải có ít nhất 2 ký tự";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Tên bàn không được quá 50 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      if (table) {
        await tableService.update(table.id, formData);
        } else {
        await tableService.create({ name: formData.name });
        }
        onSuccess();

      onSuccess();
    } catch (error) {
      console.error("Error saving table:", error);
      alert("Có lỗi xảy ra khi lưu bàn!");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for form
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: easeOut }
    },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[425px] sm:w-[540px]">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <SheetHeader className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] rounded-t-lg p-6">
            <SheetTitle className="text-2xl font-bold text-[#6B4E31]">
              {table ? "Chỉnh sửa bàn" : "Thêm bàn mới"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              {table
                ? "Cập nhật thông tin bàn"
                : "Tạo bàn mới cho nhà hàng"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            {/* Tên bàn */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#6B4E31] font-medium">
                Tên bàn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ví dụ: Bàn 1, Bàn VIP..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`border-[#D2B48C] focus:border-[#6B4E31] ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <SheetFooter className="flex flex-row justify-end gap-2 pt-6 border-t border-[#D2B48C]/20">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="border-[#D2B48C] text-[#6B4E31] hover:bg-[#EED6B3]/50"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31] font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">⏳</span>
                    {table ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : (
                  <>{table ? "Cập nhật" : "Thêm mới"}</>
                )}
              </Button>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}