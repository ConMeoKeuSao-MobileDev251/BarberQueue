/**
 * Auth Store
 * Manages authentication state
 */
import { create } from "zustand";
import type { User, UserRole } from "../types";
import { clearAuthData, saveAuthData } from "../api/client";
import { authApi } from "../api/auth";

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  // Set authentication data
  setAuth: async (user, token) => {
    await saveAuthData(token, user);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // Clear authentication (invalidate token server-side first)
  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue with local logout even if API fails
    }
    await clearAuthData();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // Set loading state
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Update user data
  setUser: (user) => {
    set({ user });
  },
}));

// Selector hooks for common use cases
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useUserRole = (): UserRole | null =>
  useAuthStore((state) => state.user?.role ?? null);
