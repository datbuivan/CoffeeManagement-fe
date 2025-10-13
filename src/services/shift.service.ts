// app/services/Shift.service.ts
import { ApiResponse } from "@/model/api-response.model";
import BaseService from "./base.service";
import { Shift } from "@/model/shift.model";

class ShiftService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getAll(): Promise<ApiResponse<Shift[]>> {
    return await this.get<Shift[]>("/Shifts");
  }

  async getById(id: string): Promise<ApiResponse<Shift>> {
    return this.get<Shift>(`/Shifts/${id}`);
  }

  async create(Shift: Partial<Shift>): Promise<ApiResponse<Shift>> {
    return this.post<Shift, Partial<Shift>>("/Shifts", Shift);
  }

  async update(id: string, Shift: Partial<Shift>): Promise<ApiResponse<Shift>> {
    return this.put<Shift, Partial<Shift>>(`/Shifts/${id}`, Shift);
  }

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/Shifts/${id}`);
  }
}

export const shiftService = new ShiftService();
