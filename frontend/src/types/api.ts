/**
 * BarberQueue API Types
 * TypeScript interfaces for all API requests/responses
 */

// ========== Auth ==========
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterClientRequest {
  phoneNumber: string;
  password: string;
  fullName: string;
  email?: string;
  address?: CreateAddressRequest;
}

// ========== User ==========
export type UserRole = "client" | "staff" | "owner";

export interface User {
  id: number;
  phoneNumber: string;
  fullName: string;
  email: string | null;
  role: UserRole;
  addressId: number | null;
  branchId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

// ========== Address ==========
export interface Address {
  id: number;
  addressText: string;
  latitude: number;
  longitude: number;
}

export interface CreateAddressRequest {
  addressText: string;
  latitude: number;
  longitude: number;
}

// ========== Branch ==========
export interface Branch {
  id: number;
  name: string;
  phoneNumber: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchRequest {
  name: string;
  phoneNumber: string;
  address: CreateAddressRequest;
}

// ========== Service ==========
export interface Service {
  id: number;
  name: string;
  duration: number; // minutes
  price: number; // VND
}

export interface CreateServiceRequest {
  name: string;
  duration: number;
  price: number;
}

// ========== Booking ==========
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: number;
  status: BookingStatus;
  startAt: string;
  endAt: string;
  totalDuration: number;
  totalPrice: number;
  clientId: number;
  staffId: number;
  createdAt: string;
  updatedAt: string;
  services?: Service[];
  staff?: User;
  client?: User;
}

export interface CreateBookingRequest {
  status: BookingStatus;
  startAt: string;
  endAt: string;
  totalDuration: number;
  totalPrice: number;
  clientId: number;
  staffId: number;
}

export interface BookingHistoryResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateBookingServiceRequest {
  bookingId: number;
  serviceId: number;
}

// ========== Pagination ==========
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// ========== API Response Wrapper ==========
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
