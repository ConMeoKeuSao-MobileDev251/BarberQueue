/**
 * Bookings API Functions
 */
import { apiClient } from "./client";
import type {
  Booking,
  BookingStatusAction,
  CreateBookingRequest,
  CreateBookingServiceRequest,
  PaginationQuery,
} from "../types";

export const bookingsApi = {
  /**
   * Create a new booking
   */
  create: async (data: CreateBookingRequest): Promise<Booking> => {
    console.log("[bookingsApi.create] Sending request to POST /booking");
    console.log("[bookingsApi.create] Data:", JSON.stringify(data, null, 2));
    try {
      const response = await apiClient.post<Booking>("/booking", data);
      console.log("[bookingsApi.create] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[bookingsApi.create] Error:", error);
      throw error;
    }
  },

  /**
   * Get a booking by ID
   */
  getById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/booking/${id}`);
    return response.data;
  },

  /**
   * Get booking history (filtered by authenticated user on backend)
   * @param params - Pagination params
   */
  getHistory: async (params?: PaginationQuery): Promise<Booking[]> => {
    console.log("[bookingsApi.getHistory] Fetching from GET /booking/history", params);
    try {
      const response = await apiClient.get<Booking[]>("/booking/history", {
        params,
      });
      console.log("[bookingsApi.getHistory] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[bookingsApi.getHistory] Error:", error);
      throw error;
    }
  },

  /**
   * Associate a service with a booking
   */
  addService: async (data: CreateBookingServiceRequest): Promise<void> => {
    await apiClient.post("/booking-service", data);
  },

  /**
   * Change booking status
   * @param bookingId - Booking ID
   * @param status - New status: 'confirm' | 'complete' | 'cancel'
   */
  changeStatus: async (
    bookingId: number,
    status: BookingStatusAction
  ): Promise<Booking> => {
    const response = await apiClient.post<Booking>(
      `/booking/${bookingId}/status/${status}`
    );
    return response.data;
  },
};
