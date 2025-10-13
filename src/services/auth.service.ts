import { LoginRequest } from "@/model/login.model";
import BaseService from "./base.service";
import { AuthResponse } from "@/model/auth-response.model";
import { ApiResponse } from "@/model/api-response.model";
import { TokenRequest } from "@/model/token.model";
import { LoginApiResponse } from "@/model/login-api-response";

class AuthService extends BaseService {
  constructor() {
    super(); // hoặc để undefined nếu dùng default từ BaseService
  }

  async login(payload: LoginRequest): Promise<ApiResponse<LoginApiResponse>> {
    return this.post<LoginApiResponse>("/Auth/login", payload);
  }

  async logout(): Promise<ApiResponse<string>> {
    return this.post<string>("/Auth/logout");
  }

  async refreshToken(
    payload: TokenRequest
  ): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse, TokenRequest>(
      "/Auth/refresh-token",
      payload
    );
  }
}

export const authService = new AuthService();
