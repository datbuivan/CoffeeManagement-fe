export interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: string;
  userId: string;
  fullName: string;
  roleName: string;
}