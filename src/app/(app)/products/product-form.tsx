// app/products/product-form.tsx
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Category } from "@/model/category.model";
import { Product } from "@/model/product.model";
import { productService } from "@/services/product.service";
import { toast } from "sonner";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: Category[];
  onSuccess: () => void;
}

export default function ProductForm({
  isOpen,
  onClose,
  product,
  categories,
  onSuccess,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form khi mở hoặc thay đổi product
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name,
          categoryId: product.categoryId,
          isAvailable: product.isAvailable ?? true,
        });
        setImagePreview(product.imageUrl || null);
        setImageFile(null);
      } else {
        setFormData({ name: "", categoryId: "", isAvailable: true });
        setImagePreview(null);
        setImageFile(null);
      }
      setErrors({});
    }
  }, [isOpen, product]);

  // Xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error("Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, GIF.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Kích thước ảnh không được vượt quá 5MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Validate dữ liệu
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    } else if (formData.name.length < 2) {
      newErrors.name = "Tên sản phẩm phải có ít nhất 2 ký tự";
    } else if (formData.name.length > 100) {
      newErrors.name = "Tên sản phẩm không được quá 100 ký tự";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý lưu sản phẩm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      setIsLoading(true);
      const submitData = { ...formData };
      if (imageFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('name', submitData.name);
        formDataToSend.append('categoryId', submitData.categoryId);
        formDataToSend.append('isAvailable', submitData.isAvailable.toString());
        formDataToSend.append('image', imageFile);
        console.log("form", formDataToSend);
        if (product) {
          await productService.updateWithfile(product.id, formDataToSend);
          toast.success("Cập nhật sản phẩm thành công!");
        } else {
          await productService.createWithFile(formDataToSend);
          toast.success("Thêm sản phẩm thành công!");
        }
      } else {
        if (product) {
          await productService.update(product.id, submitData);
          toast.success("Cập nhật sản phẩm thành công!");
        } else {
          await productService.create(submitData);
          toast.success("Thêm sản phẩm thành công!");
        }
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Có lỗi xảy ra khi lưu sản phẩm!");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeOut } },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[440px] sm:w-[560px]">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <SheetHeader className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] rounded-t-lg p-6">
            <SheetTitle className="text-2xl font-bold text-[#6B4E31]">
              {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              {product
                ? "Cập nhật thông tin sản phẩm hiện có"
                : "Tạo sản phẩm mới cho danh mục"}
            </SheetDescription>
          </SheetHeader>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            {/* Tên sản phẩm */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#6B4E31] font-medium">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên sản phẩm"
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

            {/* Danh mục */}
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-[#6B4E31] font-medium">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger
                  id="categoryId"
                  className={`border-[#D2B48C] focus:border-[#6B4E31] w-full ${
                    errors.categoryId ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId}</p>
              )}
            </div>

            {/* Upload ảnh */}
            <div className="space-y-2">
              <Label className="text-[#6B4E31] font-medium">Ảnh sản phẩm</Label>
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  hidden
                  onChange={handleImageChange}
                />
                <div className="w-full h-48 border-2 border-dashed border-[#D2B48C] rounded-lg flex items-center justify-center bg-gray-50 relative overflow-hidden">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                      >
                        Xóa
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">Chưa có ảnh</p>
                      <Button
                        type="button"
                        asChild
                        className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31]"
                      >
                        <label htmlFor="image">Chọn ảnh</label>
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#6B4E31]/60 mt-1">
                  Định dạng: JPG, JPEG, PNG, GIF (Tối đa 5MB)
                </p>
              </div>
            </div>

            {/* Trạng thái bán */}
            <div className="flex items-center justify-between border-t border-[#D2B48C]/30 pt-4 mt-4">
              <Label className="text-[#6B4E31] font-medium">Đang bán</Label>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isAvailable: checked })
                }
              />
            </div>

            {/* Footer */}
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
                disabled={isLoading}
                className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31] font-medium"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">⏳</span>
                    {product ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : (
                  <>{product ? "Cập nhật" : "Thêm mới"}</>
                )}
              </Button>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
