/**
 * Branch API Functions
 */
import { apiClient } from "./client";
import type { Branch, User } from "../types";

export const branchesApi = {
  /**
   * Search branches by location
   */
  searchByLocation: async (
    latitude: number,
    longitude: number
  ): Promise<Branch[]> => {
    const response = await apiClient.get<Branch[]>("/branch", {
      params: { latitude, longitude },
    });
    return response.data;
  },

  /**
   * Get available staff by branch ID
   */
  getAvailableStaff: async (
    branchId: number,
    startTime: string,
    endTime: string
  ): Promise<User[]> => {
    const response = await apiClient.get<User[]>(
      `/users/staff/${branchId}/availability`,
      { params: { startTime, endTime } }
    );
    return response.data;
  },
};
