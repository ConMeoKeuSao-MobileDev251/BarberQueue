/**
 * Auth API Tests
 * Tests for authentication API functions
 */
import { authApi } from "../auth";
import { apiClient } from "../client";
import {
  mockUser,
  mockLoginResponse,
  createMockAxiosResponse,
  createMockAxiosError,
} from "../../__tests__/test-utils";
import type { LoginRequest, RegisterClientRequest } from "../../types";

// Mock the apiClient
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    const loginData: LoginRequest = {
      phoneNumber: "0912345678",
      password: "password123",
    };

    it("should call POST /auth/login with credentials", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockLoginResponse)
      );

      await authApi.login(loginData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "/auth/login",
        loginData
      );
    });

    it("should return login response on success", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockLoginResponse)
      );

      const result = await authApi.login(loginData);

      expect(result).toEqual(mockLoginResponse);
      expect(result.accessToken).toBe(mockLoginResponse.accessToken);
      expect(result.phoneNumber).toBe(mockLoginResponse.phoneNumber);
    });

    it("should throw on invalid credentials", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(401, "Invalid credentials")
      );

      await expect(authApi.login(loginData)).rejects.toThrow();
    });

    it("should throw on network error", async () => {
      mockedApiClient.post.mockRejectedValueOnce(new Error("Network Error"));

      await expect(authApi.login(loginData)).rejects.toThrow("Network Error");
    });
  });

  describe("registerClient", () => {
    const registerData: RegisterClientRequest = {
      phoneNumber: "0912345678",
      password: "password123",
      fullName: "Test User",
      email: "test@example.com",
      role: "client",
      addressText: "Ho Chi Minh City",
      latitude: 10.7769,
      longitude: 106.7009,
    };

    it("should call POST /auth/register/client with data", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockUser)
      );

      await authApi.registerClient(registerData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "/auth/register/client",
        registerData
      );
    });

    it("should return user on success", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockUser)
      );

      const result = await authApi.registerClient(registerData);

      expect(result).toEqual(mockUser);
      expect(result.phoneNumber).toBe(mockUser.phoneNumber);
    });

    it("should throw on duplicate phone number", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(409, "Phone number already exists")
      );

      await expect(authApi.registerClient(registerData)).rejects.toThrow();
    });
  });

  describe("registerStaffOrOwner", () => {
    const staffData = {
      phoneNumber: "0987654321",
      password: "password123",
      fullName: "Staff User",
      email: "staff@example.com",
      role: "staff" as const,
      branchId: 1,
    };

    it("should call POST /auth/register/staff-or-owner", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockLoginResponse)
      );

      await authApi.registerStaffOrOwner(staffData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "/auth/register/staff-or-owner",
        staffData
      );
    });

    it("should return login response on success", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockLoginResponse)
      );

      const result = await authApi.registerStaffOrOwner(staffData);

      expect(result.accessToken).toBeDefined();
    });
  });

  describe("getCurrentUser", () => {
    it("should call GET /auth/me", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockUser)
      );

      await authApi.getCurrentUser();

      expect(mockedApiClient.get).toHaveBeenCalledWith("/auth/me");
    });

    it("should return user profile on success", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockUser)
      );

      const result = await authApi.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(result.id).toBe(mockUser.id);
    });

    it("should throw on 401 unauthorized", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(401, "Unauthorized")
      );

      await expect(authApi.getCurrentUser()).rejects.toThrow();
    });
  });

  describe("forgotPassword", () => {
    const forgotData = { phoneNumber: "0912345678" };

    it("should call POST /auth/forgot-password", async () => {
      mockedApiClient.post.mockResolvedValueOnce(createMockAxiosResponse(null));

      await authApi.forgotPassword(forgotData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "/auth/forgot-password",
        forgotData
      );
    });

    it("should complete without error on success", async () => {
      mockedApiClient.post.mockResolvedValueOnce(createMockAxiosResponse(null));

      await expect(authApi.forgotPassword(forgotData)).resolves.not.toThrow();
    });
  });

  describe("resetPassword", () => {
    const resetData = {
      token: "reset-token",
      newPassword: "newpassword123",
    };

    it("should call POST /auth/reset-password", async () => {
      mockedApiClient.post.mockResolvedValueOnce(createMockAxiosResponse(null));

      await authApi.resetPassword(resetData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "/auth/reset-password",
        resetData
      );
    });

    it("should throw on invalid token", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(400, "Invalid or expired token")
      );

      await expect(authApi.resetPassword(resetData)).rejects.toThrow();
    });
  });

  describe("logout", () => {
    it("should call POST /auth/logout", async () => {
      mockedApiClient.post.mockResolvedValueOnce(createMockAxiosResponse(null));

      await authApi.logout();

      expect(mockedApiClient.post).toHaveBeenCalledWith("/auth/logout");
    });

    it("should complete without error on success", async () => {
      mockedApiClient.post.mockResolvedValueOnce(createMockAxiosResponse(null));

      await expect(authApi.logout()).resolves.not.toThrow();
    });

    it("should throw on server error", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(500, "Server error")
      );

      await expect(authApi.logout()).rejects.toThrow();
    });
  });
});
