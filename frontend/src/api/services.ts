/**
 * Services API Functions
 */
import { apiClient } from "./client";
import type { Service, CreateServiceRequest } from "../types";

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

  /**
   * Create a new barber service
   */
  create: async (data: CreateServiceRequest): Promise<Service> => {
    const response = await apiClient.post<Service>("/barber-services", data);
    return response.data;
  },
};
