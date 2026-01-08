/**
 * Test Utilities
 * Helper functions and mocks for testing
 */
import type { User, Service, Branch, Booking } from "../types";

/**
 * Mock user for testing
 */
export const mockUser: User = {
  id: 1,
  phoneNumber: "0912345678",
  fullName: "Test User",
  email: "test@example.com",
  role: "client",
  addressId: null,
  branchId: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

/**
 * Mock staff user for testing
 */
export const mockStaffUser: User = {
  id: 2,
  phoneNumber: "0987654321",
  fullName: "Staff User",
  email: "staff@example.com",
  role: "staff",
  addressId: null,
  branchId: 1,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

/**
 * Mock owner user for testing
 */
export const mockOwnerUser: User = {
  id: 3,
  phoneNumber: "0911223344",
  fullName: "Owner User",
  email: "owner@example.com",
  role: "owner",
  addressId: null,
  branchId: 1,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

/**
 * Mock service for testing
 */
export const mockService: Service = {
  id: 1,
  name: "Cắt tóc nam",
  price: 100000,
  duration: 30,
};

/**
 * Mock branch for testing
 */
export const mockBranch: Branch = {
  id: 1,
  name: "BarberQueue Q1",
  phoneNumber: "0901234567",
  latitude: 10.7769,
  longitude: 106.7009,
  districtId: 1,
  ownerId: 3,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

/**
 * Mock booking for testing
 */
export const mockBooking: Booking = {
  id: 1,
  startAt: "2024-12-25T10:00:00Z",
  endAt: "2024-12-25T10:30:00Z",
  totalDuration: 30,
  totalPrice: 100000,
  status: "pending",
  clientId: 1,
  staffId: 2,
  branchId: 1,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

/**
 * Mock auth token
 */
export const mockToken = "mock-jwt-token-for-testing";

/**
 * Mock login response
 */
export const mockLoginResponse = {
  accessToken: mockToken,
  phoneNumber: mockUser.phoneNumber,
  fullName: mockUser.fullName,
  role: mockUser.role,
};

/**
 * Create a mock axios response
 */
export function createMockAxiosResponse<T>(data: T, status = 200) {
  return {
    data,
    status,
    statusText: "OK",
    headers: {},
    config: {} as never,
  };
}

/**
 * Create a mock axios error
 */
export function createMockAxiosError(status: number, message: string) {
  const error = new Error(message) as Error & {
    response?: { status: number; data: { message: string } };
    isAxiosError: boolean;
  };
  error.response = {
    status,
    data: { message },
  };
  error.isAxiosError = true;
  return error;
}

/**
 * Wait for all promises to resolve (useful for async state updates)
 */
export function flushPromises(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Sleep for specified ms (use sparingly)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
