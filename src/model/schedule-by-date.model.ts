import { StaffShift } from "./staff-shift.model";

export interface ScheduleByDate {
  date: string;
  assignments: StaffShift[];
}
