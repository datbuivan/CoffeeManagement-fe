// app/schedules/schedule-list.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, User } from "lucide-react";
import ScheduleForm from "./schedule-form";
import { StaffShift } from "@/model/staff-shift.model";
import { Shift } from "@/model/shift.model";

interface ScheduleListProps {
  staffShifts: StaffShift[];
  shifts: Shift[];
  weekStart: Date;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

export default function ScheduleList({ 
  staffShifts, 
  shifts, 
  weekStart, 
  onUpdate, 
  onDelete 
}: ScheduleListProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<StaffShift | null>(null);

  const weekDays = (() => {
    const days = [];
    const start = new Date(weekStart);
  
    // Luôn lấy đủ 7 ngày trong tuần (Thứ 2 -> CN)
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      days.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("vi-VN", { weekday: "short" }),
      });
    }

    return days;
   })();

  const groupedShifts = staffShifts.reduce((acc: Record<string, Record<string, StaffShift[]>>, ss) => {
    if (!acc[ss.workDate]) acc[ss.workDate] = {};
    if (!acc[ss.workDate][ss.shiftId]) acc[ss.workDate][ss.shiftId] = [];
    acc[ss.workDate][ss.shiftId].push(ss);
    return acc;
  }, {});

  const staffMap = staffShifts.reduce((acc: Record<string, string>, ss) => {
    if (ss.staff?.fullName && !acc[ss.staffId]) {
      acc[ss.staffId] = ss.staff.fullName;
    }
    return acc;
  }, {});

  const handleAdd = () => {
    setEditingShift(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (shift: StaffShift) => {
    setEditingShift(shift);
    setIsSheetOpen(true);
  };

  const handleSaveSuccess = () => {
    setIsSheetOpen(false);
    setEditingShift(null);
    onUpdate();
  };

  const getShiftColor = (shiftName: string) => {
    switch (shiftName) {
      case "Ca Sáng": return "bg-green-100 text-green-800 border-green-300";
      case "Ca Chiều": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Ca Tối": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getAssignedStaffDisplay = (dayShifts: StaffShift[]) => {
    if (dayShifts.length === 0) {
      return (
        <span className="text-[#6B4E31]/30 text-xs italic">Trống</span>
      );
    }

    return (
      <div className="space-y-1">
        {dayShifts.length > 1 && (
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <User className="h-3 w-3 text-[#6B4E31]/60" />
            <span className="text-[10px] font-semibold text-[#6B4E31]/70">
              {dayShifts.length}
            </span>
          </div>
        )}
        
        {dayShifts.map((ss) => (
          <div
            key={ss.id}
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer hover:opacity-80 hover:shadow transition-all w-full justify-center ${getShiftColor(ss.shift?.name || '')}`}
            onClick={() => handleEdit(ss)}
            title={ss.notes ? `Ghi chú: ${ss.notes}` : 'Click để chỉnh sửa'}
          >
            <span className="font-semibold truncate">
              {staffMap[ss.staffId] || 'Unknown'}
            </span>
            {ss.notes && (
              <span className="ml-1 text-[9px] opacity-70 truncate max-w-[60px]">
                ({ss.notes})
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Compact Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#6B4E31]" />
          <h2 className="text-lg font-bold text-[#6B4E31]">
            Lịch Làm Việc
          </h2>
        </div>
        <Button 
          onClick={handleAdd} 
          size="sm"
          className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31] font-medium shadow h-8 text-xs"
        >
          <Plus className="mr-1 h-3 w-3" />
          Phân công
        </Button>
      </div>

      {/* Bảng lịch - chiếm hết không gian còn lại */}
      <div className="flex-1 bg-[#FAF9F6] rounded-lg shadow-sm border border-[#D2B48C]/20 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[800px] h-full">
            <thead className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[#6B4E31] uppercase tracking-wider border-r border-[#D2B48C]/20 w-32">
                  Ca
                </th>
                {weekDays.map((day) => (
                  <th key={day.date} className="px-2 py-2 text-center text-xs font-semibold text-[#6B4E31] uppercase tracking-wider border-l border-[#D2B48C]/10">
                    <div className="space-y-0.5">
                      <div className="text-xs">{day.dayName}</div>
                      <div className="text-[10px] font-normal text-[#6B4E31]/70">{day.date.split('-')[2]}/{day.date.split('-')[1]}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D2B48C]/10">
              {shifts.length === 0 ? (
                <tr>
                  <td colSpan={1 + weekDays.length} className="px-6 py-8 text-center text-[#6B4E31]/50 text-sm">
                    Chưa có ca làm việc
                  </td>
                </tr>
              ) : (
                shifts.filter(s => s.isActive).map((shift) => (
                  <tr key={shift.id} className="hover:bg-[#EED6B3]/10">
                    <td className="px-3 py-2 whitespace-nowrap text-xs font-semibold text-[#6B4E31] border-r border-[#D2B48C]/20 bg-[#F5F5DC]/50">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${getShiftColor(shift.name).replace('text-', 'bg-').replace('border-', '')}`} />
                        <div>
                          <div className="font-semibold">{shift.name}</div>
                          <div className="text-[10px] text-[#6B4E31]/60">{shift.startTime}-{shift.endTime}</div>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day) => {
                      const dayShifts = groupedShifts[day.date]?.[shift.id] || [];
                      return (
                        <td 
                          key={day.date} 
                          className="px-1.5 py-2 text-center relative border-l border-[#D2B48C]/10 align-top group"
                        >
                          <div className="min-h-[50px] flex flex-col items-center justify-center">
                            {getAssignedStaffDisplay(dayShifts)}
                          </div>
                          
                          {/* Nút thêm - hiện khi hover */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAdd()}
                            className={`absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[#6B4E31]/50 hover:bg-[#D2B48C]/20 h-5 text-[10px] px-2`}
                          >
                            <Plus className="h-3 w-3 mr-0.5" />
                            {dayShifts.length === 0 ? 'Gán' : 'Thêm'}
                          </Button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sheet Form */}
      <ScheduleForm
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        editingShift={editingShift}
        shifts={shifts}
        weekStart={weekStart}
        onSuccess={handleSaveSuccess}
        onDelete={onDelete}
      />
    </div>
  );
}