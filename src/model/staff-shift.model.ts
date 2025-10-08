import { Shift } from "./shift.model";

export interface StaffShift {
  id: string;
  staffId: string;
  shiftId: string;
  workDate: string; // ISO date string, e.g., "2025-10-07"
  notes?: string;
  staff?: { id: string; fullName: string; userName: string }; // Partial User
  shift?: Shift;
}
