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
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Update user profile (PUT)
   */
  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user by ID
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
