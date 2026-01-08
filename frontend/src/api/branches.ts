/**
 * Branch API Functions
 */
import { apiClient } from "./client";
import type { Branch, User, CreateBranchRequest } from "../types";

// Default HCM center coordinates for fetching all branches
const DEFAULT_HCM_COORDS = { latitude: 10.7769, longitude: 106.7009 };

export const branchesApi = {
  /**
   * Get all branches (workaround - no getById endpoint)
   * Uses default HCM coords to fetch branch list for lookup
   */
  getAll: async (): Promise<Branch[]> => {
    const response = await apiClient.get<Branch[]>("/branch", {
      params: DEFAULT_HCM_COORDS,
    });
    return response.data;
  },

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

  /**
   * Create a new branch
   */
  create: async (data: CreateBranchRequest): Promise<Branch> => {
    const response = await apiClient.post<Branch>("/branch", data);
    return response.data;
  },

  /**
   * Delete a branch by ID
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/branch/${id}`);
  },
};
