/**
 * Users API Tests
 * Tests for user-related API functions
 */
import { usersApi } from "../users";
import { apiClient } from "../client";
import {
  mockUser,
  createMockAxiosResponse,
  createMockAxiosError,
} from "../../__tests__/test-utils";

// Mock the apiClient
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("Users API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    const userId = 1;

    it("should call GET /users/:id", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockUser)
      );

      await usersApi.getById(userId);

      expect(mockedApiClient.get).toHaveBeenCalledWith(`/users/${userId}`);
    });

    it("should return user on success", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockUser)
      );

      const result = await usersApi.getById(userId);

      expect(result).toEqual(mockUser);
      expect(result.id).toBe(userId);
    });

    it("should throw on not found", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(404, "User not found")
      );

      await expect(usersApi.getById(999)).rejects.toThrow();
    });

    it("should throw on unauthorized", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(401, "Unauthorized")
      );

      await expect(usersApi.getById(userId)).rejects.toThrow();
    });
  });

  describe("update", () => {
    const userId = 1;
    const updateData = {
      fullName: "Updated Name",
      email: "updated@example.com",
    };

    it("should call PUT /users/:id", async () => {
      mockedApiClient.put.mockResolvedValueOnce(
        createMockAxiosResponse({ ...mockUser, ...updateData })
      );

      await usersApi.update(userId, updateData);

      expect(mockedApiClient.put).toHaveBeenCalledWith(
        `/users/${userId}`,
        updateData
      );
    });

    it("should return updated user", async () => {
      const updatedUser = { ...mockUser, ...updateData };
      mockedApiClient.put.mockResolvedValueOnce(
        createMockAxiosResponse(updatedUser)
      );

      const result = await usersApi.update(userId, updateData);

      expect(result.fullName).toBe(updateData.fullName);
      expect(result.email).toBe(updateData.email);
    });

    it("should throw on validation error", async () => {
      mockedApiClient.put.mockRejectedValueOnce(
        createMockAxiosError(400, "Invalid email format")
      );

      await expect(usersApi.update(userId, updateData)).rejects.toThrow();
    });

    it("should throw on forbidden", async () => {
      mockedApiClient.put.mockRejectedValueOnce(
        createMockAxiosError(403, "Cannot update other users")
      );

      await expect(usersApi.update(userId, updateData)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    const userId = 1;

    it("should call DELETE /users/:id", async () => {
      mockedApiClient.delete.mockResolvedValueOnce(createMockAxiosResponse(null));

      await usersApi.delete(userId);

      expect(mockedApiClient.delete).toHaveBeenCalledWith(`/users/${userId}`);
    });

    it("should complete without error on success", async () => {
      mockedApiClient.delete.mockResolvedValueOnce(createMockAxiosResponse(null));

      await expect(usersApi.delete(userId)).resolves.not.toThrow();
    });

    it("should throw on not found", async () => {
      mockedApiClient.delete.mockRejectedValueOnce(
        createMockAxiosError(404, "User not found")
      );

      await expect(usersApi.delete(999)).rejects.toThrow();
    });

    it("should throw on forbidden", async () => {
      mockedApiClient.delete.mockRejectedValueOnce(
        createMockAxiosError(403, "Cannot delete other users")
      );

      await expect(usersApi.delete(userId)).rejects.toThrow();
    });
  });
});
