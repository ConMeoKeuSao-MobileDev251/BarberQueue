/**
 * Auth API Functions
 */
import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterClientRequest,
  User,
} from "../types";

export const authApi = {
  /**
   * Login with phone number and password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  /**
   * Register a new client user
   */
  registerClient: async (data: RegisterClientRequest): Promise<User> => {
    const response = await apiClient.post<User>(
      "/auth/register/client",
      data
    );
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
