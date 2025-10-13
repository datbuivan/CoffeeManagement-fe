import { OrderReportRequest } from "@/model/order-report-request.model";
import BaseService from "./base.service";
import { OrderReportResponse } from "@/model/order-report-response.model";

class OrderReportService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getOrderReport(
    request: OrderReportRequest
  ): Promise<OrderReportResponse> {
    const params = new URLSearchParams({
      fromDate: request.fromDate,
      toDate: request.toDate,
    });

    const response = await this.get<OrderReportResponse>(
      `/OrderReport?${params.toString()}`
    );
    return response.data!;
  }

  async exportPdf(request: OrderReportRequest): Promise<Blob> {
    const params = new URLSearchParams({
      fromDate: request.fromDate,
      toDate: request.toDate,
    });

    const response = await this.axios.get(
      `/OrderReport/export-pdf?${params.toString()}`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  }

  async getMonthlyReport(
    year: number,
    month: number
  ): Promise<OrderReportResponse> {
    const response = await this.get<OrderReportResponse>(
      `/OrderReport/monthly/${year}/${month}`
    );
    return response.data!;
  }

  async exportMonthlyPdf(year: number, month: number): Promise<Blob> {
    const response = await this.axios.get(
      `/OrderReport/monthly/${year}/${month}/export-pdf`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  }

  async getYearlyReport(year: number): Promise<OrderReportResponse> {
    const response = await this.get<OrderReportResponse>(
      `/OrderReport/yearly/${year}`
    );
    return response.data!;
  }

  async exportYearlyPdf(year: number): Promise<Blob> {
    const response = await this.axios.get(
      `/OrderReport/yearly/${year}/export-pdf`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  }

  async getTodayReport(): Promise<OrderReportResponse> {
    const response = await this.get<OrderReportResponse>("/OrderReport/today");
    return response.data!;
  }

  async getThisWeekReport(): Promise<OrderReportResponse> {
    const response = await this.get<OrderReportResponse>(
      "/OrderReport/this-week"
    );
    return response.data!;
  }

  async getThisMonthReport(): Promise<OrderReportResponse> {
    const response = await this.get<OrderReportResponse>(
      "/OrderReport/this-month"
    );
    return response.data!;
  }

  async getThisYearReport(): Promise<OrderReportResponse> {
    const response = await this.get<OrderReportResponse>(
      "/OrderReport/this-year"
    );
    return response.data!;
  }
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const orderReportService = new OrderReportService();
