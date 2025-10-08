// app/schedules/schedule-form.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Trash2 } from "lucide-react";
import { StaffShift } from "@/model/staff-shift.model";
import { User } from "@/model/user.model"; // Assume users from previous
import { Shift } from "@/model/shift.model";

// Mock users for select
const mockUsers: User[] = [
  { id: "user-01", userName: "admin", fullName: "Quản Trị Viên", employeeCode: "EMP001", email: "admin@coffee.com", phoneNumber: "0123456789", roles: ["Admin"] },
  { id: "user-02", userName: "staff1", fullName: "Nhân Viên 1", employeeCode: "EMP002", email: "staff1@coffee.com", phoneNumber: "0987654321", roles: ["Staff"] },
  { id: "user-03", userName: "manager", fullName: "Quản Lý", employeeCode: "EMP003", phoneNumber: "0111222333", roles: ["Manager"] },
  { id: "user-04", userName: "staff2", fullName: "Nhân Viên 2", employeeCode: "EMP004", roles: ["Staff"] },
];

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingShift?: StaffShift | null;
  shifts: Shift[];
  weekStart: Date;
  onSuccess: () => void;
  onDelete: (id: string) => void;
}

export default function ScheduleForm({
  isOpen,
  onClose,
  editingShift,
  shifts,
  weekStart,
  onSuccess,
  onDelete,
}: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    staffId: "",
    shiftId: "",
    workDate: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (editingShift) {
        setFormData({
          staffId: editingShift.staffId,
          shiftId: editingShift.shiftId,
          workDate: editingShift.workDate,
          notes: editingShift.notes || "",
        });
      } else {
        // Default to next available date in week
        const defaultDate = new Date(weekStart);
        defaultDate.setDate(defaultDate.getDate() + 1); // Mon
        setFormData({
          staffId: "",
          shiftId: shifts[0]?.id || "",
          workDate: defaultDate.toISOString().split('T')[0],
          notes: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editingShift, shifts, weekStart]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.staffId) newErrors.staffId = "Vui lòng chọn nhân viên";
    if (!formData.shiftId) newErrors.shiftId = "Vui lòng chọn ca";
    if (!formData.workDate) newErrors.workDate = "Vui lòng chọn ngày";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // TODO: API call
      // if (editingShift) {
      //   await StaffShiftService.update(editingShift.id, formData);
      // } else {
      //   await StaffShiftService.create(formData);
      // }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Save schedule:", formData);
      onSuccess();
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Có lỗi xảy ra khi lưu lịch!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (editingShift && confirm("Xóa lịch này?")) {
      onDelete(editingShift.id);
      onClose();
    }
  };

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
        <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-6">
          <SheetHeader className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] rounded-t-lg p-6">
            <SheetTitle className="text-2xl font-bold text-[#6B4E31]">
              {editingShift ? "Chỉnh sửa lịch" : "Phân công ca mới"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              Gán ca làm việc cho nhân viên
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="staffId" className="text-[#6B4E31] font-medium">
                Nhân viên <span className="text-red-500">*</span>
              </Label>
              <select
                id="staffId"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                className={`w-full p-2 border border-[#D2B48C] rounded-md focus:border-[#6B4E31] ${errors.staffId ? "border-red-500" : ""}`}
              >
                <option value="">Chọn nhân viên</option>
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.userName})
                  </option>
                ))}
              </select>
              {errors.staffId && <p className="text-sm text-red-500">{errors.staffId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shiftId" className="text-[#6B4E31] font-medium">
                Ca làm <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.shiftId} onValueChange={(value) => setFormData({ ...formData, shiftId: value })}>
                <SelectTrigger className="border-[#D2B48C] focus:border-[#6B4E31]">
                  <SelectValue placeholder="Chọn ca" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.filter(s => s.isActive).map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.name} ({shift.startTime}-{shift.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.shiftId && <p className="text-sm text-red-500">{errors.shiftId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workDate" className="text-[#6B4E31] font-medium">
                Ngày làm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="workDate"
                type="date"
                value={formData.workDate}
                onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                className={`border-[#D2B48C] focus:border-[#6B4E31] ${errors.workDate ? "border-red-500" : ""}`}
                min={weekStart.toISOString().split('T')[0]}
                max={new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              {errors.workDate && <p className="text-sm text-red-500">{errors.workDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-[#6B4E31] font-medium">
                Ghi chú
              </Label>
              <Textarea
                id="notes"
                placeholder="Ghi chú thêm (tùy chọn)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border-[#D2B48C] focus:border-[#6B4E31] min-h-[80px]"
              />
            </div>

            <SheetFooter className="flex flex-row justify-end gap-2 pt-6 border-t border-[#D2B48C]/20">
              {editingShift && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              )}
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
                    {editingShift ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : (
                  <>{editingShift ? "Cập nhật" : "Thêm mới"}</>
                )}
              </Button>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}