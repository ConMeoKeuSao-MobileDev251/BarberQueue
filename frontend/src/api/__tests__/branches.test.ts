/**
 * Branches API Tests
 * Tests for branch-related API functions
 */
import { branchesApi } from "../branches";
import { apiClient } from "../client";
import {
  mockBranch,
  mockStaffUser,
  createMockAxiosResponse,
  createMockAxiosError,
} from "../../__tests__/test-utils";

// Mock the apiClient
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("Branches API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call GET /branch with default HCM coords", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockBranch])
      );

      await branchesApi.getAll();

      expect(mockedApiClient.get).toHaveBeenCalledWith("/branch", {
        params: { latitude: 10.7769, longitude: 106.7009 },
      });
    });

    it("should return array of branches on success", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockBranch])
      );

      const result = await branchesApi.getAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockBranch);
    });

    it("should throw on network error", async () => {
      mockedApiClient.get.mockRejectedValueOnce(new Error("Network Error"));

      await expect(branchesApi.getAll()).rejects.toThrow("Network Error");
    });
  });

  describe("searchByLocation", () => {
    const testLat = 10.8231;
    const testLng = 106.6297;

    it("should call GET /branch with provided coords", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockBranch])
      );

      await branchesApi.searchByLocation(testLat, testLng);

      expect(mockedApiClient.get).toHaveBeenCalledWith("/branch", {
        params: { latitude: testLat, longitude: testLng },
      });
    });

    it("should return branches near location", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockBranch])
      );

      const result = await branchesApi.searchByLocation(testLat, testLng);

      expect(result).toHaveLength(1);
    });

    it("should return empty array when no branches nearby", async () => {
      mockedApiClient.get.mockResolvedValueOnce(createMockAxiosResponse([]));

      const result = await branchesApi.searchByLocation(0, 0);

      expect(result).toHaveLength(0);
    });
  });

  describe("getAvailableStaff", () => {
    const branchId = 1;
    const startTime = "2024-12-25T10:00:00Z";
    const endTime = "2024-12-25T11:00:00Z";

    it("should call GET /users/staff/:branchId/availability", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockStaffUser])
      );

      await branchesApi.getAvailableStaff(branchId, startTime, endTime);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `/users/staff/${branchId}/availability`,
        { params: { startTime, endTime } }
      );
    });

    it("should return available staff array", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockStaffUser])
      );

      const result = await branchesApi.getAvailableStaff(
        branchId,
        startTime,
        endTime
      );

      expect(result).toHaveLength(1);
      expect(result[0].role).toBe("staff");
    });

    it("should throw on invalid branch", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(404, "Branch not found")
      );

      await expect(
        branchesApi.getAvailableStaff(999, startTime, endTime)
      ).rejects.toThrow();
    });
  });

  describe("getStaffByBranch", () => {
    const branchId = 1;

    it("should call availability endpoint with full day range", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockStaffUser])
      );

      await branchesApi.getStaffByBranch(branchId);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `/users/staff/${branchId}/availability`,
        expect.objectContaining({
          params: expect.objectContaining({
            startTime: expect.any(String),
            endTime: expect.any(String),
          }),
        })
      );
    });

    it("should return all staff for branch", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockStaffUser])
      );

      const result = await branchesApi.getStaffByBranch(branchId);

      expect(result).toHaveLength(1);
    });
  });

  describe("create", () => {
    const createData = {
      name: "New Branch",
      phoneNumber: "0909090909",
      latitude: 10.8,
      longitude: 106.7,
      districtId: 1,
    };

    it("should call POST /branch with data", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse({ ...mockBranch, ...createData })
      );

      await branchesApi.create(createData);

      expect(mockedApiClient.post).toHaveBeenCalledWith("/branch", createData);
    });

    it("should return created branch", async () => {
      const newBranch = { ...mockBranch, id: 2, name: createData.name };
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(newBranch)
      );

      const result = await branchesApi.create(createData);

      expect(result.name).toBe(createData.name);
    });

    it("should throw on validation error", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(400, "Invalid data")
      );

      await expect(branchesApi.create(createData)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    const branchId = 1;

    it("should call DELETE /branch/:id", async () => {
      mockedApiClient.delete.mockResolvedValueOnce(createMockAxiosResponse(null));

      await branchesApi.delete(branchId);

      expect(mockedApiClient.delete).toHaveBeenCalledWith(`/branch/${branchId}`);
    });

    it("should complete without error on success", async () => {
      mockedApiClient.delete.mockResolvedValueOnce(createMockAxiosResponse(null));

      await expect(branchesApi.delete(branchId)).resolves.not.toThrow();
    });

    it("should throw on not found", async () => {
      mockedApiClient.delete.mockRejectedValueOnce(
        createMockAxiosError(404, "Branch not found")
      );

      await expect(branchesApi.delete(999)).rejects.toThrow();
    });
  });
});
