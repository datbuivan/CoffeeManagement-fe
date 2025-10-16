import { ApiResponse } from "@/model/api-response.model";
import BaseService from "./base.service";
import { InventoryTransaction } from "@/model/inventory-transaction.model";

class InventoryTransactionService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getAll(): Promise<ApiResponse<InventoryTransaction[]>> {
    return await this.get<InventoryTransaction[]>("/InventoryTransaction");
  }

  async getById(id: string): Promise<ApiResponse<InventoryTransaction>> {
    return await this.get<InventoryTransaction>(`/InventoryTransaction/${id}`);
  }

  async create(
    data: Partial<InventoryTransaction>
  ): Promise<ApiResponse<InventoryTransaction>> {
    return await this.post<InventoryTransaction>("/InventoryTransaction", data);
  }

  async update(
    id: string,
    data: Partial<InventoryTransaction>
  ): Promise<ApiResponse<InventoryTransaction>> {
    return await this.put<InventoryTransaction>(
      `/InventoryTransaction/${id}`,
      data
    );
  }

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return await this.delete<void>(`/InventoryTransaction/${id}`);
  }
}

export const inventoryTransactionService = new InventoryTransactionService();
