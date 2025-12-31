/**
 * Bookings API Functions
 */
import { apiClient } from "./client";
import type {
  Booking,
  BookingHistoryResponse,
  CreateBookingRequest,
  CreateBookingServiceRequest,
  PaginationQuery,
} from "../types";

export const bookingsApi = {
  /**
   * Create a new booking
   */
  create: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>("/booking", data);
    return response.data;
  },

  /**
   * Get a booking by ID
   */
  getById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/booking/${id}`);
    return response.data;
  },

  /**
   * Get booking history for a user
   * @param role - 'client' or 'staff'
   * @param userId - User ID
   * @param params - Pagination params
   */
  getHistory: async (
    role: "client" | "staff",
    userId: number,
    params?: PaginationQuery
  ): Promise<BookingHistoryResponse> => {
    const response = await apiClient.get<BookingHistoryResponse>(
      `/booking/${role}/${userId}/history`,
      { params }
    );
    return response.data;
  },

  /**
   * Associate a service with a booking
   */
  addService: async (data: CreateBookingServiceRequest): Promise<void> => {
    await apiClient.post("/booking-service", data);
  },
};
