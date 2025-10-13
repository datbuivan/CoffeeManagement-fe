import { ApiResponse } from "@/model/api-response.model";
import { ScheduleByDate } from "@/model/schedule-by-date.model";
import { StaffShiftAssign } from "@/model/staff-shift-assign.model";
import { StaffShift } from "@/model/staff-shift.model";
import BaseService from "./base.service";

class ScheduleService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getScheduleByMonth(
    year: number,
    month: number
  ): Promise<ApiResponse<ScheduleByDate[]>> {
    return await this.get<ScheduleByDate[]>(
      `/Schedule/month?year=${year}&month=${month}`
    );
  }

  async assignShifts(
    requests: StaffShiftAssign[]
  ): Promise<ApiResponse<object>> {
    return await this.post<object, StaffShiftAssign[]>(
      "/Schedule/assign-bulk",
      requests
    );
  }

  async createAssignment(
    request: StaffShiftAssign
  ): Promise<ApiResponse<StaffShift>> {
    return await this.post<StaffShift, StaffShiftAssign>(
      "/Schedule/assign",
      request
    );
  }

  async updateAssignment(
    id: string,
    request: StaffShiftAssign
  ): Promise<ApiResponse<StaffShift>> {
    return await this.put<StaffShift, StaffShiftAssign>(
      `/Schedule/assign/${id}`,
      request
    );
  }

  async removeAssignment(id: string): Promise<ApiResponse<object>> {
    return await this.delete<object>(`/Schedule/${id}`);
  }

  async getScheduleByUserId(
    staffId: string,
    month: number,
    year: number
  ): Promise<ApiResponse<ScheduleByDate[]>> {
    return await this.get<ScheduleByDate[]>(
      `/Schedule/user/${staffId}?year=${year}&month=${month}`
    );
  }
}

export const scheduleService = new ScheduleService();
