// app/my-schedule/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(utc);
dayjs.extend(isoWeek);

import { StaffShift } from "@/model/staff-shift.model";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scheduleService } from "@/services/schedule.service";
import { toast } from "sonner";

const getWeeksInMonth = (year: number, month: number) => {
  const firstDayUTC = dayjs.utc(new Date(Date.UTC(year, month, 1)));
  const lastDayUTC = dayjs.utc(new Date(Date.UTC(year, month + 1, 0)));

  let current = firstDayUTC.startOf("isoWeek");
  const end = lastDayUTC.endOf("isoWeek");

  const weeks: { start: Date; end: Date; label: string }[] = [];

  while (current.isBefore(end) || current.isSame(end, "day")) {
    const weekStart = current;
    const weekEnd = current.endOf("isoWeek");

    if (
      weekEnd.isAfter(firstDayUTC) &&
      weekStart.isBefore(lastDayUTC.endOf("day"))
    ) {
      weeks.push({
        start: weekStart.toDate(),
        end: weekEnd.toDate(),
        label: `${weekStart.date()}/${weekStart.month() + 1} - ${weekEnd.date()}/${weekEnd.month() + 1}`,
      });
    }

    current = weekStart.add(1, "week").startOf("isoWeek");
  }

  return weeks;
};

const findCurrentWeekIndex = (weeks: ReturnType<typeof getWeeksInMonth>, today: Date) => {
  const t = dayjs.utc(today).startOf("day");
  const idx = weeks.findIndex((w) => {
    const s = dayjs.utc(w.start).startOf("day");
    const e = dayjs.utc(w.end).endOf("day");
    return !t.isBefore(s) && !t.isAfter(e);
  });
  return idx >= 0 ? idx : 0;
};

export default function MySchedulePage() {
  const today = useMemo(() => dayjs.utc(), []);
  const initialWeeks = getWeeksInMonth(today.year(), today.month());
  const initialIndex = findCurrentWeekIndex(initialWeeks, today.toDate());
  const initialWeekStart = initialWeeks[initialIndex]?.start || today.toDate();

  const [staffShifts, setStaffShifts] = useState<StaffShift[]>([]);
  const [selectedYear, setSelectedYear] = useState(today.year());
  const [selectedMonth, setSelectedMonth] = useState(today.month());
  const [weeksInMonth, setWeeksInMonth] = useState(initialWeeks);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialIndex);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(initialWeekStart);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStaffId, setCurrentStaffId] = useState<string>("");
  const [staffName, setStaffName] = useState<string>("");

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({ value: i, label: `Tháng ${i + 1}` }));

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) {
          setCurrentStaffId(user.id);
          setStaffName(user.fullName || user.userName || "Bạn");
        } else {
          toast.error("Không tìm thấy thông tin người dùng");
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        toast.error("Lỗi đọc thông tin người dùng");
      }
    } else {
      toast.error("Vui lòng đăng nhập để xem lịch làm việc");
    }
  }, []);

  useEffect(() => {
    const newWeeks = getWeeksInMonth(selectedYear, selectedMonth);
    setWeeksInMonth(newWeeks);

    const nowInMonth = dayjs.utc().year(selectedYear).month(selectedMonth);
    const isCurrentMonth = nowInMonth.isSame(dayjs.utc(), 'month');

    if (isCurrentMonth) {
      const idx = findCurrentWeekIndex(newWeeks, dayjs.utc().toDate());
      setCurrentWeekIndex(idx);
      setCurrentWeekStart(newWeeks[idx]?.start || newWeeks[0].start);
    } else {
      setCurrentWeekIndex(0);
      setCurrentWeekStart(newWeeks[0].start);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (currentStaffId) {
      loadMySchedules();
    }
  }, [,selectedMonth, selectedYear, currentStaffId]);

  const loadMySchedules = async () => {
    if (!currentStaffId) return;
    
    setIsLoading(true);
    try {
      const res = await scheduleService.getScheduleByUserId(
        currentStaffId,
        selectedMonth + 1,
        selectedYear
      );
      console.log("currentStaffId:", currentStaffId);
      console.log("API response:", res.data);
      
      if (res.statusCode === 200 && res.data) {
        const myShifts = res.data.flatMap((d) =>
          d.assignments.map((a) => ({
            id: a.id,
            staffId: a.staffId,
            shiftId: a.shiftId,
            workDate: a.workDate,
            staff: { 
              id: a.staff?.id ?? "", 
              fullName: a.staff?.fullName ?? "", 
              userName: a.staff?.userName ?? "" 
            },
            shift: {
              id: a.shift?.id ?? "",
              name: a.shift?.name ?? "",
              startTime: a.shift?.startTime ?? "",
              endTime: a.shift?.endTime ?? "",
              isActive: a.shift?.isActive ?? true,
            },
            notes: a.notes ?? "",
          }))
        );
        setStaffShifts(myShifts);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch làm việc:", err);
      toast.error("Không thể tải lịch làm việc");
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize weekDays
  const weekDays = useMemo(() => {
    const days = [];
    const start = dayjs(currentWeekStart);
    const today = dayjs().format('YYYY-MM-DD');
  
    for (let i = 0; i < 7; i++) {
      const date = start.add(i, 'day');
      days.push({
        date: date.format('YYYY-MM-DD'),
        dayName: date.format('ddd'),
        dayNum: date.format('DD'),
        month: date.format('MM'),
        isToday: date.format('YYYY-MM-DD') === today,
      });
    }

    return days;
  }, [currentWeekStart]);

  // Group shifts by date
  const groupedShifts = useMemo(() => {
    return staffShifts.reduce((acc: Record<string, StaffShift[]>, ss) => {
      if (!acc[ss.workDate]) acc[ss.workDate] = [];
      acc[ss.workDate].push(ss);
      return acc;
    }, {});
  }, [staffShifts]);

  const handlePreviousWeek = () => {
    if (currentWeekIndex > 0) {
      const newIndex = currentWeekIndex - 1;
      setCurrentWeekIndex(newIndex);
      setCurrentWeekStart(weeksInMonth[newIndex].start);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < weeksInMonth.length - 1) {
      const nextWeek = weeksInMonth[currentWeekIndex + 1];
      setCurrentWeekIndex((i) => i + 1);
      setCurrentWeekStart(nextWeek.start);
    }
  };

  const handleToday = () => {
    const now = dayjs.utc();
    const weeks = getWeeksInMonth(now.year(), now.month());
    const idx = findCurrentWeekIndex(weeks, now.toDate());
    setSelectedYear(now.year());
    setSelectedMonth(now.month());
    setWeeksInMonth(weeks);
    setCurrentWeekIndex(idx);
    setCurrentWeekStart(weeks[idx].start);
  };

  const getShiftColor = (shiftName: string) => {
    const normalized = shiftName.toLowerCase().trim();
    
    if (normalized.includes('sáng') || normalized.includes('morning')) {
      return "bg-green-500";
    }
    if (normalized.includes('chiều') || normalized.includes('afternoon')) {
      return "bg-yellow-500";
    }
    if (normalized.includes('tối') || normalized.includes('evening') || normalized.includes('night')) {
      return "bg-purple-500";
    }
    
    return "bg-gray-500";
  };

  const getShiftBgColor = (shiftName: string) => {
    const normalized = shiftName.toLowerCase().trim();
    
    if (normalized.includes('sáng') || normalized.includes('morning')) {
      return "bg-green-50 border-green-200";
    }
    if (normalized.includes('chiều') || normalized.includes('afternoon')) {
      return "bg-yellow-50 border-yellow-200";
    }
    if (normalized.includes('tối') || normalized.includes('evening') || normalized.includes('night')) {
      return "bg-purple-50 border-purple-200";
    }
    
    return "bg-gray-50 border-gray-200";
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  if (!currentStaffId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-[#6B4E31]/30 mx-auto mb-4" />
          <p className="text-[#6B4E31]/60">Vui lòng đăng nhập để xem lịch làm việc</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col p-4 overflow-hidden"
    >
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-[#FAF9F6] to-[#F5F5DC] rounded-lg shadow-sm border border-[#D2B48C]/30 p-3 mb-4 flex-shrink-0"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* Staff Info */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#D2B48C]/20">
            <User className="h-5 w-5 text-[#6B4E31]" />
            <h1 className="text-lg font-bold text-[#6B4E31]">
              Lịch Làm Việc Của {staffName}
            </h1>
            <span className="text-xs text-[#6B4E31]/60 font-normal">
              ({staffShifts.length} ca trong tháng)
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Month / Year */}
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-[#6B4E31]" />
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-[110px] h-8 bg-white border-[#D2B48C] text-[#6B4E31] text-sm">
                  <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[90px] h-8 bg-white border-[#D2B48C] text-[#6B4E31] text-sm">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Week navigation */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePreviousWeek}
                disabled={currentWeekIndex === 0}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-[#D2B48C] text-[#6B4E31] hover:bg-[#EED6B3]/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center min-w-[140px]">
                <div className="text-xs font-semibold text-[#6B4E31]">
                  Tuần {currentWeekIndex + 1}/{weeksInMonth.length} •{" "}
                  {weeksInMonth[currentWeekIndex]?.label}
                </div>
              </div>

              <Button
                onClick={handleNextWeek}
                disabled={currentWeekIndex === weeksInMonth.length - 1}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-[#D2B48C] text-[#6B4E31] hover:bg-[#EED6B3]/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleToday}
                variant="outline"
                size="sm"
                className="h-8 px-3 border-[#D2B48C] text-[#6B4E31] hover:bg-[#EED6B3]/50 font-medium text-xs"
              >
                Hôm nay
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex gap-0.5">
              {weeksInMonth.map((_, index) => (
                <div
                  key={index}
                  className={`h-0.5 flex-1 rounded-full transition-all ${
                    index === currentWeekIndex
                      ? "bg-[#D2B48C]"
                      : index < currentWeekIndex
                      ? "bg-[#EED6B3]"
                      : "bg-[#F5F5DC]"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="grid grid-cols-7 gap-2 h-full">
            {weekDays.map((day) => {
              const dayShifts = groupedShifts[day.date] || [];
              
              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-[#FAF9F6] rounded-lg border-2 p-3 flex flex-col ${
                    day.isToday 
                      ? "border-[#D2B48C] shadow-md" 
                      : "border-[#D2B48C]/20"
                  }`}
                >
                  {/* Day header */}
                  <div className="text-center mb-3 pb-2 border-b border-[#D2B48C]/20">
                    <div className={`text-sm font-semibold ${
                      day.isToday ? 'text-[#D2B48C]' : 'text-[#6B4E31]'
                    }`}>
                      {day.dayName}
                    </div>
                    <div className={`text-xl font-bold ${
                      day.isToday ? 'text-[#D2B48C]' : 'text-[#6B4E31]'
                    }`}>
                      {day.dayNum}
                    </div>
                    <div className="text-[10px] text-[#6B4E31]/60">
                      Tháng {day.month}
                    </div>
                    {day.isToday && (
                      <div className="text-[9px] text-[#D2B48C] font-bold mt-1">
                        HÔM NAY
                      </div>
                    )}
                  </div>

                  {/* Shifts */}
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {dayShifts.length === 0 ? (
                      <div className="text-center py-4">
                        <CalendarIcon className="h-8 w-8 text-[#6B4E31]/20 mx-auto mb-2" />
                        <p className="text-xs text-[#6B4E31]/40 italic">
                          Không có ca
                        </p>
                      </div>
                    ) : (
                      dayShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className={`border rounded-lg p-2 space-y-1 hover:shadow-md transition-all cursor-pointer ${getShiftBgColor(shift.shift?.name || '')}`}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className={`w-2 h-2 rounded-full ${getShiftColor(shift.shift?.name || '')}`} 
                            />
                            <span className="font-semibold text-sm text-[#6B4E31]">
                              {shift.shift?.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-[#6B4E31]/70">
                            <Clock className="h-3 w-3" />
                            <span>
                              {shift.shift?.startTime} - {shift.shift?.endTime}
                            </span>
                          </div>

                          {shift.notes && (
                            <div className="text-xs text-[#6B4E31]/60 italic mt-1 pt-1 border-t border-[#D2B48C]/20">
                              📝 {shift.notes}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin h-8 w-8 border-4 border-[#D2B48C] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-[#6B4E31] font-medium">Đang tải lịch...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}