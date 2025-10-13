// app/services/category.service.ts
import { ApiResponse } from "@/model/api-response.model";
import BaseService from "./base.service";
import { Category } from "@/model/category.model";

class CategoryService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getAll(): Promise<ApiResponse<Category[]>> {
    return await this.get<Category[]>("/Category");
  }

  async getById(id: string): Promise<ApiResponse<Category>> {
    return this.get<Category>(`/Category/${id}`);
  }

  async create(category: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.post<Category, Partial<Category>>("/Category", category);
  }

  async update(
    id: string,
    category: Partial<Category>
  ): Promise<ApiResponse<Category>> {
    return this.put<Category, Partial<Category>>(`/Category/${id}`, category);
  }

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/Category/${id}`);
  }
}

export const categoryService = new CategoryService();
