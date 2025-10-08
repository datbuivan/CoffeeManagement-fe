// app/roles/role-form.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Role } from "@/model/role.model";

interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  onSuccess: () => void;
}

export default function RoleForm({
  isOpen,
  onClose,
  role,
  onSuccess,
}: RoleFormProps) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form khi mở/đóng hoặc role thay đổi
  useEffect(() => {
    if (isOpen) {
      if (role) {
        setFormData({ name: role.name, description: role.description || "" });
      } else {
        setFormData({ name: "", description: "" });
      }
      setErrors({});
    }
  }, [isOpen, role]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên vai trò không được để trống";
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
      // TODO: Gọi API ở đây
      // if (role) {
      //   await RoleService.update(role.id, formData);
      // } else {
      //   await RoleService.create(formData);
      // }

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Save role:", {
        id: role?.id,
        ...formData,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Có lỗi xảy ra khi lưu vai trò!");
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
              {role ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              {role
                ? "Cập nhật thông tin vai trò"
                : "Tạo vai trò mới cho hệ thống"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#6B4E31] font-medium">
                Tên vai trò <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ví dụ: Admin, Staff..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`border-[#D2B48C] focus:border-[#6B4E31] ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#6B4E31] font-medium">
                Mô tả
              </Label>
              <Textarea
                id="description"
                placeholder="Mô tả vai trò..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-[#D2B48C] focus:border-[#6B4E31] min-h-[80px]"
              />
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
                    {role ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : (
                  <>{role ? "Cập nhật" : "Thêm mới"}</>
                )}
              </Button>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}