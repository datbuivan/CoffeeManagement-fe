export interface User {
  id: string;
  userName: string;
  fullName: string;
  employeeCode: string;
  email?: string;
  phoneNumber?: string;
  roles: string[];
}
