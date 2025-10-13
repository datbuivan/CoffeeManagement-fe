import { ApiResponse } from "@/model/api-response.model";
import BaseService from "./base.service";
import { User } from "@/model/user.model";

type UserData = Partial<User> | FormData;

class UserService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getAll(): Promise<ApiResponse<User[]>> {
    return await this.get<User[]>("/users");
  }

  async getNonAdmin(): Promise<ApiResponse<User[]>> {
    return await this.get<User[]>("/users/non-admin");
  }

  async getById(id: string): Promise<ApiResponse<User>> {
    return await this.get<User>(`/users/${id}`);
  }

  async create(data: UserData): Promise<ApiResponse<User>> {
    return await this.post<User>("/users/create", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async update(id: string, data: UserData): Promise<ApiResponse<User>> {
    return await this.put<User>(`/users/${id}/update`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return await this.delete<void>(`/users/${id}`);
  }
}

export const userService = new UserService();
