/**
 * Services API Functions
 */
import { apiClient } from "./client";
import type { Service } from "../types";

export const servicesApi = {
  /**
   * Get all services
   */
  getAll: async (): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>("/barber-services");
    return response.data;
  },

  /**
   * Get service by ID
   */
  getById: async (id: number): Promise<Service> => {
    const response = await apiClient.get<Service>(`/barber-services/${id}`);
    return response.data;
  },
};
