// app/schedules/schedule-form.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/model/user.model";
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
import { Trash2, AlertCircle, Calendar, Clock, User as UserIcon } from "lucide-react";
import { StaffShift } from "@/model/staff-shift.model";
import { Shift } from "@/model/shift.model";
import { scheduleService } from "@/services/schedule.service";
import { userService } from "@/services/user.service";
import dayjs from "dayjs";
import { toast } from "sonner";

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingShift?: StaffShift | null;
  shifts: Shift[];
  weekStart: Date;
  onSuccess: () => void;
  onDelete: (id: string) => void;
  preSelectedDate?: string | null;
  preSelectedShiftId?: string | null;
}

export default function ScheduleForm({
  isOpen,
  onClose,
  editingShift,
  shifts,
  weekStart,
  onSuccess,
  onDelete,
  preSelectedDate,
  preSelectedShiftId,
}: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    staffId: "",
    shiftId: "",
    workDate: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<User[]>([]);

  // Memoize active shifts
  const activeShifts = useMemo(() => {
    return shifts.filter(s => s.isActive !== false);
  }, [shifts]);

  // Memoize week date range
  const weekDateRange = useMemo(() => {
    const start = dayjs(weekStart);
    const end = start.add(6, 'day');
    return {
      min: start.format('YYYY-MM-DD'),
      max: end.format('YYYY-MM-DD'),
      display: `${start.format('DD/MM')} - ${end.format('DD/MM/YYYY')}`,
    };
  }, [weekStart]);

  // Load users
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Initialize form data
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
        // Use pre-selected values or defaults
        const defaultDate = preSelectedDate || dayjs(weekStart).format('YYYY-MM-DD');
        const defaultShift = preSelectedShiftId || activeShifts[0]?.id || "";
        
        setFormData({
          staffId: "",
          shiftId: defaultShift,
          workDate: defaultDate,
          notes: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editingShift, preSelectedDate, preSelectedShiftId, weekStart, activeShifts]);

  const loadUsers = async () => {
    setIsLoadingStaff(true);
    try {
      const res = await userService.getNonAdmin();
      if (res.statusCode === 200 && res.data) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      // Fallback to empty array
      setUsers([]);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.staffId) {
      newErrors.staffId = "Vui lòng chọn nhân viên";
    }
    if (!formData.shiftId) {
      newErrors.shiftId = "Vui lòng chọn ca làm việc";
    }
    if (!formData.workDate) {
      newErrors.workDate = "Vui lòng chọn ngày làm việc";
    } else {
      // Validate date is within week range
      const date = dayjs(formData.workDate);
      const start = dayjs(weekStart);
      const end = start.add(6, 'day');
      
      if (date.isBefore(start, 'day') || date.isAfter(end, 'day')) {
        newErrors.workDate = `Ngày phải trong tuần ${weekDateRange.display}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (editingShift) {
        const res = await scheduleService.updateAssignment(editingShift.id, formData);
        if(res.statusCode === 200 && res.data){
          toast.success("Cập nhật thành công");
        }
      } else {
        const res = await scheduleService.createAssignment(formData);
        if(res.statusCode === 200 && res.data){
          toast.success("Thêm thành công");
        }
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving schedule:", error);

      const err = error as { response?: { data?: { message?: string } } };
      const errorMsg = err.response?.data?.message || "Có lỗi xảy ra khi lưu lịch";

      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingShift) return;
    
    if (confirm(`Xóa phân công cho ${editingShift.staff?.fullName}?`)) {
      try {
        await onDelete(editingShift.id);
        onClose();
      } catch (error) {
        console.error("Error deleting schedule:", error);
        alert("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  const selectedShift = useMemo(() => {
    return activeShifts.find(s => s.id === formData.shiftId);
  }, [activeShifts, formData.shiftId]);

  const selectedStaff = useMemo(() => {
    return users.find(u => u.id === formData.staffId);
  }, [users, formData.staffId]);

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
      <SheetContent className="w-[600px] sm:w-[500px] max-w-none sm:max-w-none h-full">
        <motion.div 
          variants={formVariants} 
          initial="hidden" 
          animate="visible" 
          className="space-y-6 pb-6"
        >
          <SheetHeader className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] rounded-lg ">
            <SheetTitle className="text-2xl font-bold text-[#6B4E31]">
              {editingShift ? "Chỉnh sửa lịch làm việc" : "Phân công ca mới"}
            </SheetTitle>
            <SheetDescription className="text-[#6B4E31]/80">
              {editingShift 
                ? `Chỉnh sửa ca cho ${editingShift.staff?.fullName}`
                : `Gán ca làm việc cho nhân viên trong tuần ${weekDateRange.display}`
              }
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            {/* Error Alert */}
            <AnimatePresence>
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Staff Selection */}
            <div className="space-y-2">
              <Label htmlFor="staffId" className="text-[#6B4E31] font-medium flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Nhân viên <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.staffId} 
                onValueChange={(value) => setFormData({ ...formData, staffId: value })}
                disabled={isLoadingStaff || !!editingShift}
                onOpenChange={(open) => {
                if (open && users.length === 0) {
                  loadUsers(); // Lấy nhân viên nếu chưa có
                }
              }}
              >
                <SelectTrigger 
                  className={`border-[#D2B48C] focus:border-[#6B4E31] w-full${
                    errors.staffId ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder={isLoadingStaff ? "Đang tải..." : "Chọn nhân viên"} />
                </SelectTrigger>
                <SelectContent>
                  {users.length === 0 && !isLoadingStaff ? (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      Không có nhân viên
                    </div>
                  ) : (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.fullName}</span>
                          {/* <span className="text-xs text-gray-500">
                            @{user.userName} • {user.employeeCode || 'N/A'}
                          </span> */}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.staffId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.staffId}
                </p>
              )}
              {editingShift && (
                <p className="text-xs text-[#6B4E31]/60">
                  Không thể thay đổi nhân viên khi chỉnh sửa
                </p>
              )}
            </div>

            {/* Shift Selection */}
            <div className="space-y-2">
              <Label htmlFor="shiftId" className="text-[#6B4E31] font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Ca làm việc <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.shiftId} 
                onValueChange={(value) => setFormData({ ...formData, shiftId: value })}
              >
                <SelectTrigger 
                  className={`border-[#D2B48C] focus:border-[#6B4E31] w-full${
                    errors.shiftId ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn ca làm việc" />
                </SelectTrigger>
                <SelectContent>
                  {activeShifts.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      Không có ca làm việc
                    </div>
                  ) : (
                    activeShifts.map((shift) => (
                      <SelectItem key={shift.id} value={shift.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{shift.name}</span>
                          <span className="text-xs text-gray-500">
                            ({shift.startTime} - {shift.endTime})
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.shiftId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.shiftId}
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="workDate" className="text-[#6B4E31] font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ngày làm việc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="workDate"
                type="date"
                value={formData.workDate}
                onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                className={`border-[#D2B48C] focus:border-[#6B4E31] ${
                  errors.workDate ? "border-red-500" : ""
                }`}
                min={weekDateRange.min}
                max={weekDateRange.max}
              />
              {errors.workDate && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.workDate}
                </p>
              )}
              <p className="text-xs text-[#6B4E31]/60">
                Tuần hiện tại: {weekDateRange.display}
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-[#6B4E31] font-medium">
                Ghi chú (Tùy chọn)
              </Label>
              <Textarea
                id="notes"
                placeholder="Thêm ghi chú cho ca làm việc này..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border-[#D2B48C] focus:border-[#6B4E31] min-h-[60px] resize-none"
                maxLength={200}
              />
              <p className="text-xs text-[#6B4E31]/60 text-right">
                {formData.notes.length}/200 ký tự
              </p>
            </div>

            {/* Preview Card */}
            {(selectedStaff || selectedShift) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#F5F5DC]/30 border border-[#D2B48C]/30 rounded-lg p-2 space-y-2"
              >
                <p className="text-xs font-semibold text-[#6B4E31]/70 uppercase">
                  Xem trước
                </p>
                {selectedStaff && (
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-4 w-4 text-[#6B4E31]/60" />
                    <span className="font-medium text-[#6B4E31]">
                      {selectedStaff.fullName}
                    </span>
                    <span className="text-xs text-[#6B4E31]/60">
                      @{selectedStaff.userName}
                    </span>
                  </div>
                )}
                {selectedShift && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[#6B4E31]/60" />
                    <span className="font-medium text-[#6B4E31]">
                      {selectedShift.name}
                    </span>
                    <span className="text-xs text-[#6B4E31]/60">
                      {selectedShift.startTime} - {selectedShift.endTime}
                    </span>
                  </div>
                )}
                {formData.workDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-[#6B4E31]/60" />
                    <span className="font-medium text-[#6B4E31]">
                      {dayjs(formData.workDate).format('dddd, DD/MM/YYYY')}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Footer */}
            <SheetFooter className="flex flex-row justify-between gap-2 pt-6 border-t border-[#D2B48C]/20">
              <div className="flex gap-2">
                {editingShift && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
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
                  disabled={isLoading || isLoadingStaff}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 animate-spin">⏳</span>
                      {editingShift ? "Đang cập nhật..." : "Đang thêm..."}
                    </>
                  ) : (
                    <>{editingShift ? "Cập nhật" : "Thêm mới"}</>
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}