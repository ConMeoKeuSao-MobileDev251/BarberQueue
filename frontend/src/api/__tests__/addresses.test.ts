/**
 * Addresses API Tests
 * Tests for address-related API functions
 */
import { addressesApi } from "../addresses";
import { apiClient } from "../client";
import {
  createMockAxiosResponse,
  createMockAxiosError,
} from "../../__tests__/test-utils";
import type { Address } from "../../types";

// Mock the apiClient
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockAddress: Address = {
  id: 1,
  addressText: "123 Nguyen Hue, District 1",
  latitude: 10.7769,
  longitude: 106.7009,
  userId: 1,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("Addresses API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call GET /address", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockAddress])
      );

      await addressesApi.getAll();

      expect(mockedApiClient.get).toHaveBeenCalledWith("/address");
    });

    it("should return array of addresses", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockAddress])
      );

      const result = await addressesApi.getAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockAddress);
    });

    it("should return empty array when no addresses", async () => {
      mockedApiClient.get.mockResolvedValueOnce(createMockAxiosResponse([]));

      const result = await addressesApi.getAll();

      expect(result).toHaveLength(0);
    });

    it("should throw on unauthorized", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(401, "Unauthorized")
      );

      await expect(addressesApi.getAll()).rejects.toThrow();
    });
  });

  describe("create", () => {
    const createData = {
      addressText: "456 Le Loi, District 1",
      latitude: 10.78,
      longitude: 106.71,
    };

    it("should call POST /address", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse({ id: 2, ...createData, userId: 1 })
      );

      await addressesApi.create(createData);

      expect(mockedApiClient.post).toHaveBeenCalledWith("/address", createData);
    });

    it("should return created address", async () => {
      const newAddress = {
        id: 2,
        ...createData,
        userId: 1,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(newAddress)
      );

      const result = await addressesApi.create(createData);

      expect(result.addressText).toBe(createData.addressText);
    });

    it("should throw on validation error", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(400, "Invalid coordinates")
      );

      await expect(addressesApi.create(createData)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    const addressId = 1;

    it("should call DELETE /address/:id", async () => {
      mockedApiClient.delete.mockResolvedValueOnce(createMockAxiosResponse(null));

      await addressesApi.delete(addressId);

      expect(mockedApiClient.delete).toHaveBeenCalledWith(
        `/address/${addressId}`
      );
    });

    it("should complete without error on success", async () => {
      mockedApiClient.delete.mockResolvedValueOnce(createMockAxiosResponse(null));

      await expect(addressesApi.delete(addressId)).resolves.not.toThrow();
    });

    it("should throw on not found", async () => {
      mockedApiClient.delete.mockRejectedValueOnce(
        createMockAxiosError(404, "Address not found")
      );

      await expect(addressesApi.delete(999)).rejects.toThrow();
    });

    it("should throw on forbidden", async () => {
      mockedApiClient.delete.mockRejectedValueOnce(
        createMockAxiosError(403, "Cannot delete other users addresses")
      );

      await expect(addressesApi.delete(addressId)).rejects.toThrow();
    });
  });
});
