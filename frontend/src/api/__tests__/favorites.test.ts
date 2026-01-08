/**
 * Favorites API Tests
 * Tests for favorites-related API functions
 */
import { favoritesApi } from "../favorites";
import { apiClient } from "../client";
import {
  mockBranch,
  createMockAxiosResponse,
  createMockAxiosError,
} from "../../__tests__/test-utils";
import type { Favorite } from "../../types";

// Mock the apiClient
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockFavorite: Favorite = {
  id: 1,
  branchId: 1,
  userId: 1,
  branch: mockBranch,
  createdAt: "2024-01-01T00:00:00Z",
};

describe("Favorites API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("add", () => {
    const branchId = 1;

    it("should call POST /favorite/branch/:branchId", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockFavorite)
      );

      await favoritesApi.add(branchId);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        `/favorite/branch/${branchId}`
      );
    });

    it("should return created favorite", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockFavorite)
      );

      const result = await favoritesApi.add(branchId);

      expect(result.branchId).toBe(branchId);
      expect(result.branch).toBeDefined();
    });

    it("should throw on already favorited", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(409, "Already in favorites")
      );

      await expect(favoritesApi.add(branchId)).rejects.toThrow();
    });

    it("should throw on branch not found", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(404, "Branch not found")
      );

      await expect(favoritesApi.add(999)).rejects.toThrow();
    });
  });

  describe("getAll", () => {
    it("should call GET /favorite/user", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockFavorite])
      );

      await favoritesApi.getAll();

      expect(mockedApiClient.get).toHaveBeenCalledWith("/favorite/user");
    });

    it("should return array of favorites", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockFavorite])
      );

      const result = await favoritesApi.getAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockFavorite);
    });

    it("should return empty array when no favorites", async () => {
      mockedApiClient.get.mockResolvedValueOnce(createMockAxiosResponse([]));

      const result = await favoritesApi.getAll();

      expect(result).toHaveLength(0);
    });

    it("should throw on unauthorized", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(401, "Unauthorized")
      );

      await expect(favoritesApi.getAll()).rejects.toThrow();
    });
  });

  describe("remove", () => {
    const branchId = 1;

    it("should call DELETE /favorite/branch/:branchId", async () => {
      mockedApiClient.delete.mockResolvedValueOnce(createMockAxiosResponse(null));

      await favoritesApi.remove(branchId);

      expect(mockedApiClient.delete).toHaveBeenCalledWith(
        `/favorite/branch/${branchId}`
      );
    });

    it("should complete without error on success", async () => {
      mockedApiClient.delete.mockResolvedValueOnce(createMockAxiosResponse(null));

      await expect(favoritesApi.remove(branchId)).resolves.not.toThrow();
    });

    it("should throw on not in favorites", async () => {
      mockedApiClient.delete.mockRejectedValueOnce(
        createMockAxiosError(404, "Not in favorites")
      );

      await expect(favoritesApi.remove(999)).rejects.toThrow();
    });
  });
});
