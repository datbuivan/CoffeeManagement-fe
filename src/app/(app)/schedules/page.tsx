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
import { User } from "@/model/user.model";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- MOCK DATA ---
const initialShifts: Shift[] = [
  { id: "shift-01", name: "Ca Sáng", startTime: "08:00", endTime: "12:00", isActive: true },
  { id: "shift-02", name: "Ca Chiều", startTime: "14:00", endTime: "18:00", isActive: true },
  { id: "shift-03", name: "Ca Tối", startTime: "18:00", endTime: "22:00", isActive: true },
];

const mockUsers: User[] = [
  { id: "user-01", userName: "admin", fullName: "Quản Trị Viên", employeeCode: "EMP001", email: "admin@coffee.com", phoneNumber: "0123456789", roles: ["Admin"] },
  { id: "user-02", userName: "staff1", fullName: "Nhân Viên 1", employeeCode: "EMP002", email: "staff1@coffee.com", phoneNumber: "0987654321", roles: ["Staff"] },
  { id: "user-03", userName: "manager", fullName: "Quản Lý", employeeCode: "EMP003", phoneNumber: "0111222333", roles: ["Manager"] },
  { id: "user-04", userName: "staff2", fullName: "Nhân Viên 2", employeeCode: "EMP004", roles: ["Staff"] },
];

const initialStaffShifts: StaffShift[] = [
  { id: "ss-01", staffId: "user-01", shiftId: "shift-01", workDate: "2025-10-07", notes: "", staff: mockUsers[0] },
  { id: "ss-02", staffId: "user-02", shiftId: "shift-02", workDate: "2025-10-07", notes: "Phụ trách quầy", staff: mockUsers[1] },
  { id: "ss-03", staffId: "user-03", shiftId: "shift-01", workDate: "2025-10-08", notes: "", staff: mockUsers[2] },
  { id: "ss-04", staffId: "user-04", shiftId: "shift-03", workDate: "2025-10-08", notes: "", staff: mockUsers[3] },
  { id: "ss-05", staffId: "user-02", shiftId: "shift-01", workDate: "2025-10-10", notes: "", staff: mockUsers[1] },
  { id: "ss-06", staffId: "user-01", shiftId: "shift-02", workDate: "2025-10-12", notes: "", staff: mockUsers[0] },
  { id: "ss-07", staffId: "user-03", shiftId: "shift-02", workDate: "2025-10-09", notes: "Kiểm tra kho", staff: mockUsers[2] },
];

const getWeeksInMonth = (year: number, month: number) => {
  const firstDayUTC = dayjs.utc(new Date(Date.UTC(year, month, 1)));
  const lastDayUTC = dayjs.utc(new Date(Date.UTC(year, month + 1, 0)));

  // Tuần đầu tiên bắt đầu từ thứ 2 trước ngày 1
  let current = firstDayUTC.startOf("isoWeek");
  const end = lastDayUTC.endOf("isoWeek");

  const weeks: { start: Date; end: Date; label: string }[] = [];

  while (current.isBefore(end) || current.isSame(end, "day")) {
    const weekStart = current;
    const weekEnd = current.endOf("isoWeek");

    // Lấy tất cả các tuần có giao với tháng hiện tại
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

    // ✅ Fix: clone trước khi cộng, tránh mutation gây lệch vòng lặp
    current = weekStart.add(1, "week").startOf("isoWeek");
  }

  return weeks;
};

// Test thử tháng 10/2025
console.log(getWeeksInMonth(2025, 9));



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

  const [staffShifts, setStaffShifts] = useState<StaffShift[]>(initialStaffShifts);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);

  const [selectedYear, setSelectedYear] = useState(today.year());
  const [selectedMonth, setSelectedMonth] = useState(today.month());

  const [weeksInMonth, setWeeksInMonth] = useState(initialWeeks);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialIndex);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(initialWeekStart);

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({ value: i, label: `Tháng ${i + 1}` }));

  useEffect(() => {
    loadSchedules();
  }, [currentWeekStart]);

  useEffect(() => {
    const weeks = getWeeksInMonth(selectedYear, selectedMonth);
    setWeeksInMonth(weeks);
    setCurrentWeekIndex(0);
    setCurrentWeekStart(weeks[0]?.start || new Date(Date.UTC(selectedYear, selectedMonth, 1)));
  }, [selectedYear, selectedMonth]);

  const loadSchedules = async () => {
    // TODO: call API using UTC-formatted weekStart
    // example: weekStartStr = dayjs.utc(currentWeekStart).format('YYYY-MM-DD')
    setShifts(initialShifts);
    setStaffShifts(initialStaffShifts);
  };

  const handleDelete = async (id: string) => {
    setStaffShifts((prev) => prev.filter((ss) => ss.id !== id));
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
      const newIndex = currentWeekIndex + 1;
      setCurrentWeekIndex(newIndex);
      setCurrentWeekStart(weeksInMonth[newIndex].start);
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
