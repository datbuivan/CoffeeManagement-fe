// app/ingredients/ingredient-form.tsx
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
import { Ingredient } from "@/model/ingredient.model";
import { ingredientService } from "@/services/ingredient.service";
import { toast } from "sonner";

interface IngredientFormProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
  onSuccess: () => void;
}

export default function IngredientForm({
  isOpen,
  onClose,
  ingredient,
  onSuccess,
}: IngredientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    reorderLevel: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form khi mở/đóng hoặc ingredient thay đổi
  useEffect(() => {
    if (isOpen) {
      if (ingredient) {
        setFormData({
          name: ingredient.name,
          unit: ingredient.unit,
          reorderLevel: ingredient.reorderLevel,
        });
      } else {
        setFormData({
          name: "",
          unit: "",
          reorderLevel: 0,
        });
      }
      setErrors({});
    }
  }, [isOpen, ingredient]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên nguyên liệu không được để trống";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên nguyên liệu phải có ít nhất 2 ký tự";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Tên nguyên liệu không được quá 100 ký tự";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Đơn vị tính không được để trống";
    } else if (formData.unit.trim().length > 20) {
      newErrors.unit = "Đơn vị tính không được quá 20 ký tự";
    }

    if (formData.reorderLevel < 0) {
      newErrors.reorderLevel = "Mức đặt hàng lại không được âm";
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
      if (ingredient) {
        const res = await ingredientService.update(ingredient.id, formData);
        if(res.statusCode === 201 && res.data){
            toast.success("Thêm thành công")
        }
      } else {
        const res = await ingredientService.create(formData);
        if(res.statusCode === 200 && res.data){
            toast.success("Sửa thành công")
        }
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving ingredient:", error);
      toast.error("Có lỗi xảy ra khi lưu nguyên liệu!");
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
      transition: { duration: 0.3, ease: easeOut },
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
              {ingredient ? "Chỉnh sửa nguyên liệu" : "Thêm nguyên liệu mới"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              {ingredient
                ? "Cập nhật thông tin nguyên liệu"
                : "Tạo nguyên liệu mới cho kho"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            {/* Tên nguyên liệu */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#6B4E31] font-medium">
                Tên nguyên liệu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ví dụ: Cà phê Arabica, Sữa tươi..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`border-[#D2B48C] focus:border-[#6B4E31] ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Đơn vị tính */}
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-[#6B4E31] font-medium">
                Đơn vị tính <span className="text-red-500">*</span>
              </Label>
              <Input
                id="unit"
                placeholder="Ví dụ: kg, lít, gram..."
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className={`border-[#D2B48C] focus:border-[#6B4E31] ${
                  errors.unit ? "border-red-500" : ""
                }`}
              />
              {errors.unit && (
                <p className="text-sm text-red-500">{errors.unit}</p>
              )}
            </div>

            {/* Mức đặt hàng lại */}
            <div className="space-y-2">
              <Label
                htmlFor="reorderLevel"
                className="text-[#6B4E31] font-medium"
              >
                Mức đặt hàng lại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reorderLevel"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.reorderLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reorderLevel: parseFloat(e.target.value) || 0,
                  })
                }
                className={`border-[#D2B48C] focus:border-[#6B4E31] ${
                  errors.reorderLevel ? "border-red-500" : ""
                }`}
              />
              {errors.reorderLevel && (
                <p className="text-sm text-red-500">{errors.reorderLevel}</p>
              )}
              <p className="text-xs text-[#6B4E31]/60">
                Cảnh báo khi tồn kho thấp hơn mức này
              </p>
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
                    {ingredient ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : (
                  <>{ingredient ? "Cập nhật" : "Thêm mới"}</>
                )}
              </Button>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}