// app/services/base.service.ts
import { ApiResponse } from "@/model/api-response.model";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export default class BaseService {
  protected axios: AxiosInstance;

  constructor(baseURL?: string) {
    this.axios = axios.create({
      baseURL:
        baseURL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "https://localhost:7200/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor xử lý lỗi
    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError<unknown>) => {
        // Nếu response có dữ liệu và là đối tượng có field "message"
        const data = error.response?.data;
        let message = "Đã xảy ra lỗi không xác định.";

        if (typeof data === "object" && data !== null && "message" in data) {
          const msg = (data as Record<string, unknown>)["message"];
          if (typeof msg === "string") {
            message = msg;
          }
        } else if (error.message) {
          message = error.message;
        }

        console.error("API Error:", message);
        return Promise.reject(new Error(message));
      }
    );
  }

  protected async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axios.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  protected async post<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axios.post<ApiResponse<T>>(url, body, config);
    return response.data;
  }

  protected async put<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axios.put<ApiResponse<T>>(url, body, config);
    return response.data;
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axios.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}
