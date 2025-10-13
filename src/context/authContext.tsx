"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { LoginRequest } from "@/model/login.model";
import { AuthResponse } from "@/model/auth-response.model";
import { AuthContextType } from "@/model/auth-context-type";
import { useRouter } from "next/navigation";
import { storageService } from "@/services/storage.service";
import { User } from "@/model/user.model";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState< User  | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    const initAuth = () => {

      try {
        if (!storageService.isStorageAvailable()) {
          console.warn("localStorage is not available");
          setLoading(false);
          return;
        }
        
        if (storageService.isAuthenticated()) {
          const storedUser = storageService.getUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            storageService.clearAuth();
          }
        } else {
          storageService.clearAuth();
        }

      }catch(error){
        console.error("Error initializing auth:", error);
        storageService.clearAuth();
      }finally {
        setLoading(false);
      }    
    };
    initAuth();
  }, []);

  const refreshTokenIfNeeded = useCallback(async () => {
  if (isRefreshingRef.current) return;

  try {
    if (!storageService.willExpireSoon(15)) return;

    const refreshToken = storageService.getRefreshToken();
    const accessToken = storageService.getAccessToken();

    if (!refreshToken || !accessToken) {
      await logout();
      return;
    }

    isRefreshingRef.current = true;

    const res = await authService.refreshToken({
      accessToken,
      refreshToken,
    });

    if (res.statusCode === 200 && res.data) {
      storageService.storeTokens(
        res.data.accessToken,
        res.data.refreshToken,
        res.data.accessTokenExpires
      );

      if (res.data.user) {
        storageService.updateUser(res.data.user);
        setUser(res.data.user);
      }
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    await logout();
  } finally {
    isRefreshingRef.current = false;
  }
}, []);

  useEffect(() => {
    if (!user) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    refreshIntervalRef.current = setInterval(() => {
      refreshTokenIfNeeded();
    }, 60 * 1000);

    refreshTokenIfNeeded();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user, refreshTokenIfNeeded]);

  const login = useCallback(async (payload: LoginRequest) => {
    try {
      const res = await authService.login(payload);

      if (res.statusCode !== 200 || !res.data) {
        toast.error(res.message || "Đăng nhập thất bại!");
        return;
      }

      const userData: AuthResponse = {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        accessTokenExpires: res.data.accessTokenExpires,
        user: {
          id: res.data.userId,
          fullName: res.data.fullName,
          roleName: res.data.roleName,
        },
      };

      storageService.storeUser(userData);
      setUser(userData.user);

      toast.success("Đăng nhập thành công!");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Đăng nhập thất bại!";
      toast.error(errMsg);
      console.error("Login error:", error);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      authService.logout().catch((error) => {
        console.error("Logout API error:", error);
      });
      
      storageService.clearAuth();
      setUser(null);

      toast.success("Đã đăng xuất!");
      
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      storageService.clear();
      setUser(null);
      router.push("/login");
    } 
  }, [router]);

  const updateUser = useCallback((updatedUser: User) => {
    try {
      storageService.updateUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Không thể cập nhật thông tin người dùng");
    }
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user && !storageService.isTokenExpired(),
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};