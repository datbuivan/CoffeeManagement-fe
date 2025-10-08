import { ApiResponse } from "@/model/api-response.model";
import { Product } from "@/model/product.model";
import BaseService from "./base.service";

class ProductService extends BaseService {
  constructor() {
    super("https://localhost:7200/api");
  }

  async getAll(): Promise<ApiResponse<Product[]>> {
    return await this.get<Product[]>("/Product");
  }

  async getById(id: string): Promise<ApiResponse<Product>> {
    return await this.get<Product>(`/Product/${id}`);
  }

  async create(data: Partial<Product>): Promise<ApiResponse<Product>> {
    return await this.post<Product>("/Product", data);
  }

  async update(
    id: string,
    data: Partial<Product>
  ): Promise<ApiResponse<Product>> {
    return await this.put<Product>(`/Product/${id}`, data);
  }

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return await this.delete<void>(`/Product/${id}`);
  }
}

export const productService = new ProductService();
