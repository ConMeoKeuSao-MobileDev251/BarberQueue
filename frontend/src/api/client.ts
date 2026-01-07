/**
 * Axios API Client
 * Configured with interceptors for auth and error handling
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { API_CONFIG, STORAGE_KEYS } from "../constants/config";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - inject auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // SecureStore not available (web) - ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
      } catch {
        // SecureStore not available (web) - ignore
      }
      // Navigation to login will be handled by auth store listener
    }
    return Promise.reject(error);
  }
);

// Helper to check if token exists
export async function hasValidToken(): Promise<boolean> {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  } catch {
    return false;
  }
}

// Helper to save auth data
export async function saveAuthData(
  token: string,
  userData: object
): Promise<void> {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    await SecureStore.setItemAsync(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData)
    );
  } catch {
    // SecureStore not available (web) - use fallback
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }
  }
}

// Helper to clear auth data
export async function clearAuthData(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
  } catch {
    // SecureStore not available (web) - use fallback
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }
}

// Helper to get stored auth data (for session restoration)
export async function getStoredAuthData(): Promise<{
  token: string | null;
  user: object | null;
}> {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    const userDataStr = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
    const user = userDataStr ? JSON.parse(userDataStr) : null;
    return { token, user };
  } catch {
    // SecureStore not available (web) - try localStorage
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const user = userDataStr ? JSON.parse(userDataStr) : null;
      return { token, user };
    }
    return { token: null, user: null };
  }
}
