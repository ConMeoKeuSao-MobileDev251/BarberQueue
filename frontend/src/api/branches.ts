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
   * Get available staff by branch ID with time constraints
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

  /**
   * Get all staff for a branch
   */
  getStaffByBranch: async (branchId: number): Promise<User[]> => {
    // Use availability endpoint with wide time range to get all staff
    const today = new Date();
    const startTime = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endTime = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const response = await apiClient.get<User[]>(
      `/users/staff/${branchId}/availability`,
      { params: { startTime, endTime } }
    );
    return response.data;
  },
};
