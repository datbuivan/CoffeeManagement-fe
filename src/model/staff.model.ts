import { Role } from "./role.model";

export type StaffStatus = "Đang hoạt động" | "Tạm nghỉ";

export type Staff = {
  id: string;
  name: string;
  email: string;
  gender: "Nam" | "Nữ" | "Khác";
  birthDate?: Date;
  idCardNumber?: string;
  idCardIssueDate?: Date;
  role: Role;
  roleId: string;
  workShift?: string;
  avatarUrl?: string;
  status: StaffStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type StaffFormData = Pick<
  Staff,
  | "name"
  | "email"
  | "gender"
  | "birthDate"
  | "idCardNumber"
  | "idCardIssueDate"
  | "roleId"
  | "workShift"
  | "avatarUrl"
>;
