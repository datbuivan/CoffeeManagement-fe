import { ApiResponse } from "@/model/api-response.model";
import { TokenResponse } from "@/model/token-response.model";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosHeaders,
} from "axios";
import { storageService } from "./storage.service";

export default class BaseService {
  protected axios: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor(baseURL?: string) {
    this.axios = axios.create({
      baseURL:
        baseURL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "https://localhost:7200/api",
      headers: { "Content-Type": "application/json" },
    });

    // --- Request interceptor ---
    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = AxiosHeaders.from(config.headers || {});
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    });

    // --- Response interceptor ---
    this.axios.interceptors.response.use(
      (res) => res,
      async (
        error: AxiosError<ApiResponse<unknown>> & {
          config?: AxiosRequestConfig & { _retry?: boolean };
        }
      ) => {
        const originalRequest = error.config;

        // Handle 401 (Unauthorized)
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.handleTokenRefresh();

            if (originalRequest.headers) {
              originalRequest.headers = AxiosHeaders.from(
                originalRequest.headers
              );
              originalRequest.headers.set(
                "Authorization",
                `Bearer ${newAccessToken}`
              );
            }
            return this.axios(originalRequest);
          } catch (err) {
            storageService.clearAuth();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return Promise.reject(err);
          }
        }

        let message = "Đã xảy ra lỗi không xác định.";
        const data = error.response?.data;
        if (
          data &&
          typeof data === "object" &&
          "message" in data &&
          typeof (data as ApiResponse<unknown>).message === "string"
        ) {
          message =
            (data as ApiResponse<unknown>).message ??
            "Đã xảy ra lỗi không xác định.";
        } else if (error.message) {
          message = error.message;
        }

        return Promise.reject(new Error(message));
      }
    );
  }

  private async handleTokenRefresh(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = storageService.getRefreshToken();
        const accessToken = storageService.getAccessToken();

        if (!refreshToken || !accessToken) {
          throw new Error("No tokens available");
        }

        const res = await axios.post<ApiResponse<TokenResponse>>(
          `${
            process.env.NEXT_PUBLIC_API_URL || "https://localhost:7200/api"
          }/auth/refresh-token`,
          { accessToken, refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const data = res.data.data;
        if (!data) {
          throw new Error("Không nhận được token mới từ server.");
        }

        storageService.storeTokens(
          data.accessToken,
          data.refreshToken,
          data.accessTokenExpires
        );

        return data.accessToken;
      } finally {
        // Clear the promise after completion (success or failure)
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  // --- Các phương thức HTTP chuẩn hóa ---
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
    const isFormData = body instanceof FormData;
    const response = await this.axios.post<ApiResponse<T>>(url, body, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    return response.data;
  }

  protected async put<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;
    const response = await this.axios.put<ApiResponse<T>>(url, body, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    return response.data;
  }

  protected async patch<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;
    const response = await this.axios.patch<ApiResponse<T>>(url, body, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
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
