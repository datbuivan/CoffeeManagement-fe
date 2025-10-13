// app/schedules/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(utc);
dayjs.extend(isoWeek);

import { StaffShift } from "@/model/staff-shift.model";
import { Shift } from "@/model/shift.model";
import ScheduleList from "./schedule-list";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scheduleService } from "@/services/schedule.service";
import { toast } from "sonner";
import { shiftService } from "@/services/shift.service";



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

export default function SchedulesPage() {
  const today = useMemo(() => dayjs.utc(), []);
  const initialWeeks = getWeeksInMonth(today.year(), today.month());
  const initialIndex = findCurrentWeekIndex(initialWeeks, today.toDate());
  const initialWeekStart = initialWeeks[initialIndex]?.start || today.toDate();

  const [staffShifts, setStaffShifts] = useState<StaffShift[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedYear, setSelectedYear] = useState(today.year());
  const [selectedMonth, setSelectedMonth] = useState(today.month());
  const [weeksInMonth, setWeeksInMonth] = useState(initialWeeks);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialIndex);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(initialWeekStart);
  const [isLoading, setIsLoading] = useState(false);


  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({ value: i, label: `Tháng ${i + 1}` }));

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
    loadShifts();
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [selectedMonth, selectedYear]);

  const loadShifts = async () => {
    try {
      const res = await shiftService.getAll(); 
      if (res.statusCode === 200 && res.data) {
        setShifts(res.data.filter((s: Shift) => s.isActive !== false));
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách ca làm việc:", err);
      toast.error("Không thể tải danh sách ca làm việc");
    }
  };


  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      const res = await scheduleService.getScheduleByMonth(selectedYear, selectedMonth + 1);
      if (res.statusCode === 200 && res.data) {
        const allShifts = res.data.flatMap((d) =>
          d.assignments.map((a) => ({
            id: a.id,
            staffId: a.staffId,
            shiftId: a.shiftId,
            workDate: a.workDate,
            staff: { id: a.staff?.id ?? "", fullName: a.staff?.fullName ?? "", userName: a.staff?.userName ?? "" },
            shift: {
              id: a.shift?.id  ?? "",
              name: a.shift?.name ?? "",
              startTime: a.shift?.startTime ?? "",
              endTime: a.shift?.endTime ?? "",
              isActive: a.shift?.isActive ?? true,
            },
            notes: a.notes ?? "",
          }))
        );
        setStaffShifts(allShifts);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch làm việc:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await scheduleService.removeAssignment(id);
      if (res.statusCode === 200) {
        setStaffShifts((prev) => prev.filter((ss) => ss.id !== id));
      }
    } catch (err) {
      toast.error("Xoá thất bại");
      console.error("Xóa thất bại:", err);
    }
  };
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

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

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

          {/* Mini progress bar */}
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

        {/* Schedule list */}
        <div className="flex-1 min-h-0 overflow-auto">
          <ScheduleList
            staffShifts={staffShifts}
            shifts={shifts}
            weekStart={currentWeekStart}
            onUpdate={loadSchedules}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </motion.div>
  );
}
