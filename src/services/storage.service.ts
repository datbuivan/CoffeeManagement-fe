import { AuthResponse } from "@/model/auth-response.model";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  ACCESS_TOKEN_EXPIRES: "accessTokenExpires",
  USER: "user",
} as const;

class StorageService {
  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  getAccessToken(): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  getAccessTokenExpires(): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES);
  }

  isTokenExpired(): boolean {
    if (!this.isClient()) return true;

    const expires = this.getAccessTokenExpires();
    if (!expires) return true;

    try {
      const expiryTime = new Date(expires).getTime();
      const now = new Date().getTime();
      return expiryTime <= now;
    } catch (error) {
      console.error("Error checking token expiry:", error);
      return true;
    }
  }

  getTimeUntilExpiry(): number {
    if (!this.isClient()) return 0;

    const expires = this.getAccessTokenExpires();
    if (!expires) return 0;

    try {
      const expiryTime = new Date(expires).getTime();
      const now = new Date().getTime();
      const timeUntil = expiryTime - now;
      return timeUntil > 0 ? timeUntil : 0;
    } catch (error) {
      console.error("Error calculating time until expiry:", error);
      return 0;
    }
  }

  willExpireSoon(withinMinutes: number = 60): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry();
    return timeUntilExpiry > 0 && timeUntilExpiry < withinMinutes * 60 * 1000;
  }

  storeTokens(
    accessToken: string,
    refreshToken: string,
    accessTokenExpires: string
  ): void {
    if (!this.isClient()) return;

    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(
        STORAGE_KEYS.ACCESS_TOKEN_EXPIRES,
        accessTokenExpires
      );
    } catch (error) {
      console.error("Error storing tokens:", error);
      throw new Error("Failed to store tokens");
    }
  }

  storeUser(authData: AuthResponse): void {
    if (!this.isClient()) return;

    try {
      // localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
      // localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
      // localStorage.setItem(
      //   STORAGE_KEYS.ACCESS_TOKEN_EXPIRES,
      //   authData.accessTokenExpires
      // );
      this.storeTokens(
        authData.accessToken,
        authData.refreshToken,
        authData.accessTokenExpires
      );
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user));
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  }

  getUser(): AuthResponse["user"] | null {
    if (!this.isClient()) return null;

    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error reading stored user:", error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (!this.isClient()) return false;

    const user = this.getUser();
    const accessToken = this.getAccessToken();
    const isExpired = this.isTokenExpired();

    return !!user && !!accessToken && !isExpired;
  }

  clear(): void {
    if (!this.isClient()) return;
    localStorage.clear();
  }

  clearAuth(): void {
    if (!this.isClient()) return;

    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }

  updateUser(user: AuthResponse["user"]): void {
    if (!this.isClient()) return;

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error updating user data:", error);
      throw new Error("Failed to update user data");
    }
  }

  isStorageAvailable(): boolean {
    if (!this.isClient()) return false;

    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
