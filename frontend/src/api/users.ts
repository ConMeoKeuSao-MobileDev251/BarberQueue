/**
 * Users API Functions
 */
import { apiClient } from "./client";
import type { User, UpdateUserRequest } from "../types";

export const usersApi = {
  /**
   * Get user by ID
   */
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/user/${id}`);
    return response.data;
  },

  /**
   * Update user profile
   */
  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<User>(`/user/${id}`, data);
    return response.data;
  },
};
