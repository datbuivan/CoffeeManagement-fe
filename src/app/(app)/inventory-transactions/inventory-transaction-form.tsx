// app/inventory-transactions/inventory-transaction-form.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { InventoryTransaction } from "@/model/inventory-transaction.model";
import { Ingredient } from "@/model/ingredient.model";
import { inventoryTransactionService } from "@/services/inventory-transaction.service";

interface InventoryTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: InventoryTransaction | null;
  onSuccess: () => void;
  ingredients: Ingredient[];
}

const TRANSACTION_TYPES = [
  { value: "IN", label: "Nhập kho", color: "text-green-600" },
  { value: "OUT", label: "Xuất kho", color: "text-red-600" },
  { value: "ADJUST", label: "Điều chỉnh", color: "text-blue-600" },
];

export default function InventoryTransactionForm({
  isOpen,
  onClose,
  transaction,
  onSuccess,
  ingredients,
}: InventoryTransactionFormProps) {
  const [formData, setFormData] = useState({
    ingredientId: "",
    transactionType: "",
    quantity: 0,
    unitPrice: undefined as number | undefined,
    userId: "current-user", // TODO: Get from auth context
    relatedDocumentId: undefined as string | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form khi mở/đóng hoặc transaction thay đổi
  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        setFormData({
          ingredientId: transaction.ingredientId,
          transactionType: transaction.transactionType,
          quantity: transaction.quantity,
          unitPrice: transaction.unitPrice,
          userId: transaction.userId,
          relatedDocumentId: transaction.relatedDocumentId,
        });
      } else {
        setFormData({
          ingredientId: "",
          transactionType: "",
          quantity: 0,
          unitPrice: undefined,
          userId: "current-user",
          relatedDocumentId: undefined,
        });
      }
      setErrors({});
    }
  }, [isOpen, transaction]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ingredientId) {
      newErrors.ingredientId = "Vui lòng chọn nguyên liệu";
    }

    if (!formData.transactionType) {
      newErrors.transactionType = "Vui lòng chọn loại giao dịch";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (formData.unitPrice !== undefined && formData.unitPrice < 0) {
      newErrors.unitPrice = "Đơn giá không được âm";
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


      if (transaction) {
        await inventoryTransactionService.update(transaction.id, formData);
      } else {
        await inventoryTransactionService.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Có lỗi xảy ra khi lưu giao dịch!");
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected ingredient info
  const selectedIngredient = ingredients.find(
    (ing) => ing.id === formData.ingredientId
  );

  // Calculate total amount
  const totalAmount =
    formData.unitPrice && formData.quantity
      ? formData.unitPrice * formData.quantity
      : 0;

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
      <SheetContent className="w-[425px] sm:w-[540px] overflow-y-auto">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <SheetHeader className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] rounded-t-lg p-6">
            <SheetTitle className="text-2xl font-bold text-[#6B4E31]">
              {transaction ? "Chỉnh sửa giao dịch" : "Tạo giao dịch mới"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              {transaction
                ? "Cập nhật thông tin giao dịch kho"
                : "Ghi nhận giao dịch nhập/xuất kho"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            {/* Nguyên liệu */}
            <div className="space-y-2">
              <Label htmlFor="ingredientId" className="text-[#6B4E31] font-medium">
                Nguyên liệu <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.ingredientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, ingredientId: value })
                }
              >
                <SelectTrigger
                  className={`border-[#D2B48C] focus:border-[#6B4E31] ${
                    errors.ingredientId ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn nguyên liệu..." />
                </SelectTrigger>
                <SelectContent>
                  {ingredients.map((ingredient) => (
                    <SelectItem key={ingredient.id} value={ingredient.id}>
                      {ingredient.name} ({ingredient.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ingredientId && (
                <p className="text-sm text-red-500">{errors.ingredientId}</p>
              )}
              {selectedIngredient && (
                <p className="text-xs text-[#6B4E31]/60">
                  Tồn kho hiện tại:{" "}
                  <span className="font-semibold">
                    {selectedIngredient.currentStock?.toLocaleString("vi-VN") ?? "Chưa có"}{" "}
                    {selectedIngredient.unit}
                  </span>
                </p>
              )}
            </div>

            {/* Loại giao dịch */}
            <div className="space-y-2">
              <Label
                htmlFor="transactionType"
                className="text-[#6B4E31] font-medium"
              >
                Loại giao dịch <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) =>
                  setFormData({ ...formData, transactionType: value })
                }
              >
                <SelectTrigger
                  className={`border-[#D2B48C] focus:border-[#6B4E31] ${
                    errors.transactionType ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn loại giao dịch..." />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className={type.color}>{type.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.transactionType && (
                <p className="text-sm text-red-500">{errors.transactionType}</p>
              )}
            </div>

            {/* Số lượng */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[#6B4E31] font-medium">
                Số lượng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
                className={`border-[#D2B48C] focus:border-[#6B4E31] ${
                  errors.quantity ? "border-red-500" : ""
                }`}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>

            {/* Đơn giá */}
            <div className="space-y-2">
              <Label htmlFor="unitPrice" className="text-[#6B4E31] font-medium">
                Đơn giá (tùy chọn)
              </Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="1000"
                placeholder="0"
                value={formData.unitPrice ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                className={`border-[#D2B48C] focus:border-[#6B4E31] ${
                  errors.unitPrice ? "border-red-500" : ""
                }`}
              />
              {errors.unitPrice && (
                <p className="text-sm text-red-500">{errors.unitPrice}</p>
              )}
              {totalAmount > 0 && (
                <p className="text-xs text-[#6B4E31]/60">
                  Tổng tiền:{" "}
                  <span className="font-semibold">
                    {totalAmount.toLocaleString("vi-VN")} đ
                  </span>
                </p>
              )}
            </div>

            {/* Mã chứng từ liên quan */}
            <div className="space-y-2">
              <Label
                htmlFor="relatedDocumentId"
                className="text-[#6B4E31] font-medium"
              >
                Mã chứng từ liên quan (tùy chọn)
              </Label>
              <Input
                id="relatedDocumentId"
                placeholder="Ví dụ: PO-001, INV-123..."
                value={formData.relatedDocumentId ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    relatedDocumentId: e.target.value || undefined,
                  })
                }
                className="border-[#D2B48C] focus:border-[#6B4E31]"
              />
              <p className="text-xs text-[#6B4E31]/60">
                Mã đơn hàng, phiếu xuất, hoặc tài liệu liên quan
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
                    {transaction ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : (
                  <>{transaction ? "Cập nhật" : "Tạo giao dịch"}</>
                )}
              </Button>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}