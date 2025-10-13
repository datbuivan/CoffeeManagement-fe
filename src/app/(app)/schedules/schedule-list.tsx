// app/schedules/schedule-list.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, User } from "lucide-react";
import ScheduleForm from "./schedule-form";
import { StaffShift } from "@/model/staff-shift.model";
import { Shift } from "@/model/shift.model";
import dayjs from "dayjs";

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);

  // Memoize weekDays để tránh tính toán lại mỗi lần render
  const weekDays = useMemo(() => {
    const days = [];
    const start = dayjs(weekStart);
    const today = dayjs().format('YYYY-MM-DD');
  
    for (let i = 0; i < 7; i++) {
      const date = start.add(i, 'day');
      days.push({
        date: date.format('YYYY-MM-DD'),
        dayName: date.format('ddd'), // Thứ 2, Thứ 3...
        dayNum: date.format('DD'),
        month: date.format('MM'),
        isToday: date.format('YYYY-MM-DD') === today,
      });
    }

    return days;
  }, [weekStart]);

  // Memoize grouped shifts
  const groupedShifts = useMemo(() => {
    return staffShifts.reduce((acc: Record<string, Record<string, StaffShift[]>>, ss) => {
      if (!acc[ss.workDate]) acc[ss.workDate] = {};
      if (!acc[ss.workDate][ss.shiftId]) acc[ss.workDate][ss.shiftId] = [];
      acc[ss.workDate][ss.shiftId].push(ss);
      return acc;
    }, {});
  }, [staffShifts]);

  // Memoize staff map
  const staffMap = useMemo(() => {
    return staffShifts.reduce((acc: Record<string, string>, ss) => {
      if (ss.staff?.fullName && !acc[ss.staffId]) {
        acc[ss.staffId] = ss.staff.fullName;
      }
      return acc;
    }, {});
  }, [staffShifts]);

  // Memoize active shifts
  const activeShifts = useMemo(() => {
    return shifts.filter(s => s.isActive !== false);
  }, [shifts]);

  const handleAdd = (date?: string, shiftId?: string) => {
    setEditingShift(null);
    setSelectedDate(date || null);
    setSelectedShiftId(shiftId || null);
    setIsSheetOpen(true);
  };

  const handleEdit = (shift: StaffShift) => {
    setEditingShift(shift);
    setSelectedDate(null);
    setSelectedShiftId(null);
    setIsSheetOpen(true);
  };

  const handleSaveSuccess = () => {
    setIsSheetOpen(false);
    setEditingShift(null);
    setSelectedDate(null);
    setSelectedShiftId(null);
    onUpdate();
  };

  const handleCloseForm = () => {
    setIsSheetOpen(false);
    setEditingShift(null);
    setSelectedDate(null);
    setSelectedShiftId(null);
  };

  const getShiftColor = (shiftName: string) => {
    const normalized = shiftName.toLowerCase().trim();
    
    if (normalized.includes('sáng') || normalized.includes('morning')) {
      return "bg-green-100 text-green-800 border-green-300";
    }
    if (normalized.includes('chiều') || normalized.includes('afternoon')) {
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
    if (normalized.includes('tối') || normalized.includes('evening') || normalized.includes('night')) {
      return "bg-purple-100 text-purple-800 border-purple-300";
    }
    
    return "bg-gray-100 text-gray-800 border-gray-300";
  };


const getAssignedStaffDisplay = (dayShifts: StaffShift[]) => {
  if (dayShifts.length === 0) {
    return (
      <span className="text-[#6B4E31]/30 text-xs italic">Trống</span>
    );
  }

  return (
    <div className="space-y-1.5 w-full px-1">
      {/* Hiển thị số người nếu > 1 */}
      {dayShifts.length > 1 && (
        <div className="flex items-center justify-center gap-1 mb-0.5">
          <User className="h-3 w-3 text-[#6B4E31]/60" />
          <span className="text-[10px] font-semibold text-[#6B4E31]/70">
            {dayShifts.length} người
          </span>
        </div>
      )}
      
      {dayShifts.map((ss) => (
        <div
          key={ss.id}
          className={`relative z-20 group/staff inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer hover:opacity-90 hover:shadow-md hover:scale-[1.02] transition-all w-full justify-center border ${getShiftColor(ss.shift?.name || '')}`}
          onClick={() => handleEdit(ss)}
        >
          <span className="font-semibold truncate">
            {staffMap[ss.staffId] || 'Unknown'}
          </span>

          {ss.notes && (
            <span className="text-[9px] opacity-50 flex-shrink-0">📝</span>
          )}

          {(ss.notes || ss.staff?.fullName) && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[11px] rounded-md shadow-xl opacity-0 group-hover/staff:opacity-100 transition-opacity pointer-events-none z-50 min-w-max max-w-[200px]">
            <div className="font-semibold text-yellow-300 mb-1">
              {staffMap[ss.staffId] || 'Unknown'}
            </div>

            {ss.notes && (
              <div>
                <div className="font-semibold text-yellow-300 mb-1">📝 Ghi chú:</div>
                <div className="text-gray-100">{ss.notes}</div>
              </div>
            )}

            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-900"></div>
          </div>
              )}
            </div>
          ))}
    </div>
  );
};

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#6B4E31]" />
          <h2 className="text-lg font-bold text-[#6B4E31]">
            Lịch Làm Việc
          </h2>
          <span className="text-xs text-[#6B4E31]/60 font-normal">
            ({activeShifts.length} ca, {staffShifts.length} phân công)
          </span>
        </div>
        <Button 
          onClick={() => handleAdd()} 
          size="sm"
          className="bg-[#D2B48C] hover:bg-[#EED6B3] text-[#6B4E31] font-medium shadow h-8 text-xs"
        >
          <Plus className="mr-1 h-3 w-3" />
          Phân công
        </Button>
      </div>

      {/* Schedule Table */}
      {/* Schedule Table */}
      <div className="flex-1 bg-[#FAF9F6] rounded-lg shadow-sm border border-[#D2B48C]/20 overflow-auto flex flex-col relative">
        <table className="w-full table-fixed min-w-[800px]">
          <thead className="bg-gradient-to-r from-[#F5F5DC] to-[#D2B48C] sticky top-0 z-10 shadow-sm">
            <tr>
              {/* Ca làm việc */}
              <th className="px-3 py-2 text-left text-xs font-semibold text-[#6B4E31] uppercase tracking-wider border-r border-[#D2B48C]/20 w-32">
                Ca làm việc
              </th>

              {/* 7 ngày */}
              {weekDays.map((day) => (
                <th 
                  key={day.date} 
                  className={`px-2 py-2 text-center text-xs font-semibold text-[#6B4E31] uppercase tracking-wider border-l border-[#D2B48C]/10 w-1/7 ${
                    day.isToday ? 'bg-[#EED6B3]/50' : ''
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className={`text-xs ${day.isToday ? 'font-bold' : ''}`}>
                      {day.dayName}
                    </div>
                    <div className={`text-[10px] font-normal ${
                      day.isToday ? 'text-[#6B4E31] font-semibold' : 'text-[#6B4E31]/70'
                    }`}>
                      {day.dayNum}/{day.month}
                    </div>
                    {day.isToday && (
                      <div className="text-[9px] text-[#D2B48C] font-bold">
                        Hôm nay
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#D2B48C]/10">
            {activeShifts.map((shift) => (
              <tr key={shift.id} className="hover:bg-[#EED6B3]/10 transition-colors">
                <td className="px-3 py-3 whitespace-nowrap text-xs font-semibold text-[#6B4E31] border-r border-[#D2B48C]/20 bg-[#F5F5DC]/50">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2.5 h-2.5 rounded-full ${
                        shift.name.toLowerCase().includes('sáng') 
                          ? 'bg-green-500' 
                          : shift.name.toLowerCase().includes('chiều')
                          ? 'bg-yellow-500'
                          : shift.name.toLowerCase().includes('tối')
                          ? 'bg-purple-500'
                          : 'bg-gray-500'
                      }`} 
                    />
                    <div>
                      <div className="font-semibold">{shift.name}</div>
                      <div className="text-[10px] text-[#6B4E31]/60 font-normal">
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                  </div>
                </td>

                {weekDays.map((day) => {
                  const dayShifts = groupedShifts[day.date]?.[shift.id] || [];
                  return (
                    <td 
                      key={day.date} 
                      className={`px-1.5 py-2 text-center relative border-l border-[#D2B48C]/10 align-top group w-1/7 overflow-visible ${
                        day.isToday ? 'bg-[#EED6B3]/10' : ''
                      }`}
                    >
                      <div className="min-h-[60px] flex flex-col items-center justify-center pb-6">
                        {getAssignedStaffDisplay(dayShifts)}
                      </div>

                      {/* Quick Add Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAdd(day.date, shift.id)}
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[#6B4E31]/50 hover:bg-[#D2B48C]/20 hover:text-[#6B4E31] h-5 text-[10px] px-2"
                      >
                        <Plus className="h-3 w-3 mr-0.5" />
                        {dayShifts.length === 0 ? 'Gán' : 'Thêm'}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Schedule Form */}
      <ScheduleForm
        isOpen={isSheetOpen}
        onClose={handleCloseForm}
        editingShift={editingShift}
        shifts={shifts}
        weekStart={weekStart}
        onSuccess={handleSaveSuccess}
        onDelete={onDelete}
        preSelectedDate={selectedDate}
        preSelectedShiftId={selectedShiftId}
      />
    </div>
  );
}