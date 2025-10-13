"use client";

import { useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import { storageService } from "@/services/storage.service";
import { useLoadingStore } from "@/store/loading.store";

export function useAxiosInterceptor(instance?: AxiosInstance) {
  const { startLoading, stopLoading } = useLoadingStore();

  useEffect(() => {
    const axiosInstance = instance || axios;

    // Request interceptor
    const reqInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        startLoading();
        const token = storageService.getAccessToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        stopLoading();
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const resInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        stopLoading();
        return response;
      },
      (error) => {
        stopLoading();
        return Promise.reject(error);
      }
    );

    // Cleanup khi unmount
    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [instance, startLoading, stopLoading]);
}
