import { ApiResponse } from "@/model/api-response.model";
import BaseService from "./base.service";
import { Ingredient } from "@/model/ingredient.model";

class IngredientService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getAll(): Promise<ApiResponse<Ingredient[]>> {
    return await this.get<Ingredient[]>("/Ingredients");
  }

  async getById(id: string): Promise<ApiResponse<Ingredient>> {
    return await this.get<Ingredient>(`/Ingredients/${id}`);
  }

  async create(data: Partial<Ingredient>): Promise<ApiResponse<Ingredient>> {
    return await this.post<Ingredient>("/Ingredients", data);
  }

  async update(
    id: string,
    data: Partial<Ingredient>
  ): Promise<ApiResponse<Ingredient>> {
    return await this.put<Ingredient>(`/Ingredients/${id}`, data);
  }

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return await this.delete<void>(`/Ingredients/${id}`);
  }

  async lowStock(): Promise<ApiResponse<Ingredient[]>> {
    return await this.get<Ingredient[]>("/Ingredients/low-stock");
  }
}

export const ingredientService = new IngredientService();
