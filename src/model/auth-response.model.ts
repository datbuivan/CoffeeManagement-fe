import { User } from "./user.model";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  accessTokenExpires: string; // ISO string
}
