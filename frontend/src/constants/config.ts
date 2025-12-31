/**
 * Application Configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "https://barberqueue-3eiy.onrender.com",
  TIMEOUT: 15000, // Increased for cloud hosting cold starts
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "barberqueue_auth_token",
  USER_DATA: "barberqueue_user_data",
  ONBOARDING_COMPLETE: "barberqueue_onboarding_complete",
  LANGUAGE: "barberqueue_language",
  CART: "barberqueue_cart",
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  // Auth
  currentUser: ["auth", "me"] as const,

  // Branches
  branches: ["branches"] as const,
  branch: (id: number) => ["branches", id] as const,

  // Services
  services: ["services"] as const,
  service: (id: number) => ["services", id] as const,

  // Staff
  staffAvailability: (branchId: number) =>
    ["staff", "availability", branchId] as const,

  // Bookings
  bookingHistory: (role: string, userId: number) =>
    ["bookings", role, userId] as const,
  booking: (id: number) => ["bookings", id] as const,

  // Addresses
  addresses: ["addresses"] as const,
} as const;

// Default Query/Mutation Settings
export const QUERY_DEFAULTS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
  retry: 2,
  refetchOnWindowFocus: false,
} as const;
