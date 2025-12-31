/**
 * Address API Functions
 */
import { apiClient } from "./client";
import type { Address, CreateAddressRequest } from "../types";

export const addressesApi = {
  /**
   * Get all addresses
   */
  getAll: async (): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>("/address");
    return response.data;
  },

  /**
   * Create a new address
   */
  create: async (data: CreateAddressRequest): Promise<Address> => {
    const response = await apiClient.post<Address>("/address", data);
    return response.data;
  },

  /**
   * Delete an address
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/address/${id}`);
  },
};
