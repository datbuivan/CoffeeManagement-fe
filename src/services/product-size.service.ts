import { ApiResponse } from "@/model/api-response.model";
import BaseService from "./base.service";
import { ProductSize } from "@/model/product-size.model";

class ProductSizeService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getAll(): Promise<ApiResponse<ProductSize[]>> {
    return await this.get<ProductSize[]>("/ProductSize");
  }

  async getById(id: string): Promise<ApiResponse<ProductSize>> {
    return await this.get<ProductSize>(`/ProductSize/${id}`);
  }

  async create(data: Partial<ProductSize>): Promise<ApiResponse<ProductSize>> {
    return await this.post<ProductSize>("/ProductSize", data);
  }

  async update(
    id: string,
    data: Partial<ProductSize>
  ): Promise<ApiResponse<ProductSize>> {
    return await this.put<ProductSize>(`/ProductSize/${id}`, data);
  }

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return await this.delete<void>(`/ProductSize/${id}`);
  }

  async getByProductId(id: string): Promise<ApiResponse<ProductSize[]>> {
    return await this.get<ProductSize[]>(`/ProductSize/by-product/${id}`);
  }
}

export const productSizeService = new ProductSizeService();
