import { ApiResponse } from "@/model/api-response.model";
import { Product } from "@/model/product.model";
import BaseService from "./base.service";

type ProductData = Partial<Product> | FormData;

class ProductService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
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

  async createWithFile(data: ProductData): Promise<ApiResponse<Product>> {
    return await this.post<Product>("/Product/create-with-file", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async updateWithfile(
    id: string,
    data: ProductData
  ): Promise<ApiResponse<Product>> {
    return await this.put<Product>(`/Product/${id}/with-image`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export const productService = new ProductService();
