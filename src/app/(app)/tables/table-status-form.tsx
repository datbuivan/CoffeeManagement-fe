"use client";

import { useState, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { tableService } from "@/services/table.service";
import { Table } from "@/model/table.model";
import { toast } from "sonner";

interface TableStatusFormProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  onSuccess: () => void;
}

export default function TableStatusForm({
  isOpen,
  onClose,
  table,
  onSuccess,
}: TableStatusFormProps) {
  const [status, setStatus] = useState<Table["status"]>("Available");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (table) {
      setStatus(table.status);
    }
  }, [table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!table) return;

    setIsLoading(true);
    try {
      const response = await tableService.updateStatus(table.id, { status });
      console.log(response.data);
      if (response.statusCode === 200) {
        toast.success("Cập nhật trạng thái bàn thành công");
        onSuccess();
        onClose();
    } else {
      toast.error("Không cập nhật được trạng thái của bàn");
    }
    } catch (error) {
      console.error("Error updating table status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeOut } },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[480px]">
        <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-6">
          <SheetHeader className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] rounded-t-lg p-6">
            <SheetTitle className="text-2xl font-bold text-[#6B4E31]">
              Cập nhật trạng thái bàn
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#6B4E31] font-medium">
                Trạng thái
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Table["status"])}
                className="w-full border-[#D2B48C] focus:border-[#6B4E31] bg-[#FAF9F6] text-[#6B4E31] px-3 py-2 rounded-md"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Cleaning">Cleaning</option>
              </select>
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
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
