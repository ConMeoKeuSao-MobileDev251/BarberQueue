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
  accessToken: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
}

export interface RegisterClientRequest {
  phoneNumber: string;
  password: string;
  fullName: string;
  birthDate?: string;
  email?: string;
  role?: "client";
  addressText?: string;
  latitude?: number;
  longitude?: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  resetToken: string;
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
export type BookingStatus = "pending" | "confirm" | "confirmed" | "completed" | "cancelled";
export type BookingStatusAction = "confirm" | "complete" | "cancel";

export interface Booking {
  id: number;
  status: BookingStatus;
  startAt: string;
  endAt: string;
  totalDuration: number;
  totalPrice: number;
  clientId: number;
  staffId: number;
  branchId: number;
  createdAt: string;
  updatedAt: string;
  services?: Service[];
  staff?: User;
  client?: User;
}

export interface CreateBookingRequest {
  startAt: string;
  endAt: string;
  totalDuration: number;
  totalPrice: number;
  clientId: number;
  staffId: number;
  branchId: number;
}

// API returns array directly
export type BookingHistoryResponse = Booking[];

export interface CreateBookingServiceRequest {
  bookingId: number;
  serviceId: number;
}

// ========== Review ==========
export interface Review {
  id: number;
  bookingId: number;
  branchId: number | null;
  userId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface CreateReviewRequest {
  bookingId: number;
  branchId?: number;
  rating: number;
  comment?: string;
}

export interface ReviewListResponse {
  data: Review[];
  total: number;
  page: number;
}

// ========== Favorite ==========
export interface Favorite {
  userId: number;
  branchId: number;
  createdAt: string;
  branch: Branch;
}

export interface FavoriteListResponse {
  data: Favorite[];
}

// ========== Notification ==========
export type NotificationType = "system" | "booking";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
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
