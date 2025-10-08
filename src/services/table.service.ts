// app/services/Table.service.ts
import { ApiResponse } from "@/model/api-response.model";
import BaseService from "./base.service";
import { Table } from "@/model/table.model";

class TableService extends BaseService {
  constructor() {
    super("https://localhost:7200/api");
  }

  async getAll(): Promise<ApiResponse<Table[]>> {
    return await this.get<Table[]>("/Table");
  }

  async getById(id: string): Promise<ApiResponse<Table>> {
    return this.get<Table>(`/Table/${id}`);
  }

  async create(table: Partial<Table>): Promise<ApiResponse<Table>> {
    return this.post<Table, Partial<Table>>("/Table", table);
  }

  async update(id: string, table: Partial<Table>): Promise<ApiResponse<Table>> {
    return this.put<Table, Partial<Table>>(`/Table/${id}`, table);
  }

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/Table/${id}`);
  }
}

export const tableService = new TableService();
