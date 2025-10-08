export interface Shift {
  id: string;
  name: string;
  startTime: string; // e.g., "08:00"
  endTime: string; // e.g., "12:00"
  isActive: boolean;
}
