// app/categories/category-form.tsx
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
import { Category } from "@/model/category.model";
import { categoryService } from "@/services/category.service";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSuccess: () => void;
}

export default function CategoryForm({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form khi mở/đóng hoặc category thay đổi
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({ name: category.name, description: category.description || "" });
      } else {
        setFormData({ name: "", description: "" });
      }
      setErrors({});
    }
  }, [isOpen, category]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên danh mục không được để trống";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên danh mục phải có ít nhất 2 ký tự";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Tên danh mục không được quá 50 ký tự";
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
      if (category) {
      await categoryService.update(category.id, formData);
      } else {
      await categoryService.create({ name: formData.name, description: formData.description });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Có lỗi xảy ra khi lưu danh mục!");
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
              {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              {category
                ? "Cập nhật thông tin danh mục sản phẩm"
                : "Tạo danh mục sản phẩm mới cho cửa hàng"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            {/* Tên danh mục */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#6B4E31] font-medium">
                Tên danh mục <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ví dụ: Đồ uống, Món thêm..."
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

            {/* description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#6B4E31] font-medium">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                placeholder="Ví dụ: Cà phê truyền thống..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
                    {category ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : (
                  <>{category ? "Cập nhật" : "Thêm mới"}</>
                )}
              </Button>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}