"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSize } from "@/model/product-size.model";
import { productSizeService } from "@/services/product-size.service";
import { toast } from "sonner";

interface ProductSizeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onSuccess: () => void;
}

export default function ProductSizeSheet({ isOpen, onClose, productId, onSuccess }: ProductSizeSheetProps) {
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ size: "", price: 0, productId });

  // Load size theo productId
  useEffect(() => {
    if (!isOpen) return;
    setFormData({ size: "", price: 0, productId }); // reset khi mở
    loadSizes();
  }, [isOpen, productId]);

  const loadSizes = async () => {
    setLoading(true);
    try {
      const res = await productSizeService.getByProductId(productId);
      setSizes(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải size sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const sizeName = formData.size.trim();
    const priceNum = formData.price;

    if (!sizeName) return toast.error("Tên size không được để trống");
    if (isNaN(priceNum) || priceNum <= 0) return toast.error("Giá phải > 0");

    try {
      const res = await productSizeService.create(formData);
      if (res.statusCode === 201 && res.data) {
        setSizes([...sizes, res.data]);
        setFormData({ size: "", price: 0, productId }); // reset form
        toast.success("Thêm size thành công!");
        onSuccess();
      } else {
        toast.error(res.message ?? "Không thể thêm size!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi thêm size!");
    }
  };

  const handleEdit = async (id: string, field: "size" | "price", value: string) => {
    const updatedSize = sizes.find(s => s.id === id);
    if (!updatedSize) return;

    const data: Partial<ProductSize> = {
      ...updatedSize,
      [field]: field === "price" ? parseFloat(value) : value,
    };

    try {
      const res = await productSizeService.update(id, data);
      if (res.statusCode === 200 && res.data) {
        setSizes(sizes.map(s => (s.id === id ? res.data! : s)));
        toast.success("Cập nhật size thành công!");
      } else {
        toast.error(res.message ?? "Không thể cập nhật size!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật size!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa size này?")) return;
    try {
      const res = await productSizeService.deleteById(id);
      if (res.statusCode === 200) {
        setSizes(sizes.filter(s => s.id !== id));
        toast.success("Xóa size thành công!");
        onSuccess();
      } else {
        toast.error(res.message ?? "Không thể xóa size!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa size!");
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeOut } },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[440px] sm:w-[560px]">
        <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-6">
          <SheetHeader className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] rounded-t-lg p-6">
            <SheetTitle className="text-2xl font-bold text-[#6B4E31]">Quản lý Size Sản phẩm</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 mt-6 px-6">
            {/* Thêm size mới */}
            <div className="flex gap-2">
              <Input
                placeholder="Size"
                value={formData.size}
                onChange={e => setFormData({ ...formData, size: e.target.value })}
                disabled={loading}
              />
              <Input
                placeholder="Price"
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                disabled={loading}
              />
              <Button onClick={handleAdd} disabled={loading} className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31]">
                Thêm
              </Button>
            </div>

            {/* Danh sách size */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sizes.map(s => (
                <div key={s.id} className="flex gap-2 items-center">
                  <Input
                    value={s.size}
                    onChange={e => handleEdit(s.id, "size", e.target.value)}
                    disabled={loading}
                    className="border-[#D2B48C] focus:border-[#6B4E31]"
                  />
                  <Input
                    type="number"
                    value={s.price}
                    onChange={e => handleEdit(s.id, "price", e.target.value)}
                    disabled={loading}
                    className="border-[#D2B48C] focus:border-[#6B4E31]"
                  />
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)} disabled={loading}>
                    Xóa
                  </Button>
                </div>
              ))}
              {sizes.length === 0 && <p className="text-sm text-gray-500">Chưa có size nào</p>}
            </div>
          </div>

          <SheetFooter className="flex flex-row justify-end gap-2 pt-6 border-t border-[#D2B48C]/20">
            <Button variant="outline" onClick={onClose} disabled={loading} className="border-[#D2B48C] text-[#6B4E31]">
              Hủy
            </Button>
          </SheetFooter>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
