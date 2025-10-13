// app/services/Role.service.ts
import { ApiResponse } from "@/model/api-response.model";
import BaseService from "./base.service";
import { Role } from "@/model/role.model";

class RoleService extends BaseService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  async getAll(): Promise<ApiResponse<Role[]>> {
    return await this.get<Role[]>("/Role");
  }

  async getById(id: string): Promise<ApiResponse<Role>> {
    return this.get<Role>(`/Role/${id}`);
  }

  async create(Role: Partial<Role>): Promise<ApiResponse<Role>> {
    return this.post<Role, Partial<Role>>("/Role", Role);
  }

  async update(id: string, Role: Partial<Role>): Promise<ApiResponse<Role>> {
    return this.put<Role, Partial<Role>>(`/Role/${id}`, Role);
  }

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/Role/${id}`);
  }

  async assign(id: string): Promise<ApiResponse<void>> {
    return this.put<void, null>(`/Role/assign/${id}`, null);
  }

  async getRoleByUserId(id: string): Promise<ApiResponse<string[]>> {
    return this.get<string[]>(`/Role/user/$${id}`);
  }
  async getRolesByUserIds(
    userIds: string[]
  ): Promise<ApiResponse<Record<string, string[]>>> {
    return this.post<Record<string, string[]>, string[]>(
      `/Role/by-user-ids`,
      userIds
    );
  }
}

export const roleService = new RoleService();
