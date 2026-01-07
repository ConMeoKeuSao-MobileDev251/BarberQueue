/**
 * Favorites API Functions
 */
import { apiClient } from "./client";
import type { Favorite } from "../types";

export const favoritesApi = {
  /**
   * Add a branch to favorites
   * @requires CLIENT role
   */
  add: async (branchId: number): Promise<Favorite> => {
    const response = await apiClient.post<Favorite>(
      `/favorite/branch/${branchId}`
    );
    return response.data;
  },

  /**
   * Get all user favorites (returns Favorite[] directly)
   * @requires CLIENT role
   */
  getAll: async (): Promise<Favorite[]> => {
    const response = await apiClient.get<Favorite[]>("/favorite/user");
    return response.data;
  },

  /**
   * Remove a branch from favorites
   * @requires CLIENT role
   */
  remove: async (branchId: number): Promise<void> => {
    await apiClient.delete(`/favorite/branch/${branchId}`);
  },
};
