import { TopSellingProduct } from "@/model/top-selling-product.model";
import BaseService from "./base.service";
import { ApiResponse } from "@/model/api-response.model";

class ProductTopSaleService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }
  async getTopProducts(
    period: "today" | "week" | "month" | "year"
  ): Promise<ApiResponse<TopSellingProduct[]>> {
    return await this.get<TopSellingProduct[]>(`/ProductTopSale/${period}`);
  }
}

export const productTopSaleService = new ProductTopSaleService();
