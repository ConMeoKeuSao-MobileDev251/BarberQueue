/**
 * Services API Tests
 * Tests for barber services API functions
 */
import { servicesApi } from "../services";
import { apiClient } from "../client";
import {
  mockService,
  createMockAxiosResponse,
  createMockAxiosError,
} from "../../__tests__/test-utils";

// Mock the apiClient
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("Services API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call GET /barber-services", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockService])
      );

      await servicesApi.getAll();

      expect(mockedApiClient.get).toHaveBeenCalledWith("/barber-services");
    });

    it("should return array of services", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse([mockService])
      );

      const result = await servicesApi.getAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockService);
    });

    it("should return empty array when no services", async () => {
      mockedApiClient.get.mockResolvedValueOnce(createMockAxiosResponse([]));

      const result = await servicesApi.getAll();

      expect(result).toHaveLength(0);
    });

    it("should throw on network error", async () => {
      mockedApiClient.get.mockRejectedValueOnce(new Error("Network Error"));

      await expect(servicesApi.getAll()).rejects.toThrow("Network Error");
    });
  });

  describe("getById", () => {
    const serviceId = 1;

    it("should call GET /barber-services/:id", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockService)
      );

      await servicesApi.getById(serviceId);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `/barber-services/${serviceId}`
      );
    });

    it("should return service on success", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockService)
      );

      const result = await servicesApi.getById(serviceId);

      expect(result).toEqual(mockService);
      expect(result.id).toBe(serviceId);
    });

    it("should throw on not found", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(404, "Service not found")
      );

      await expect(servicesApi.getById(999)).rejects.toThrow();
    });
  });

  describe("create", () => {
    const createData = {
      name: "New Service",
      price: 150000,
      duration: 45,
    };

    it("should call POST /barber-services", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse({ id: 2, ...createData })
      );

      await servicesApi.create(createData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "/barber-services",
        createData
      );
    });

    it("should return created service", async () => {
      const newService = { id: 2, ...createData };
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(newService)
      );

      const result = await servicesApi.create(createData);

      expect(result.name).toBe(createData.name);
      expect(result.price).toBe(createData.price);
    });

    it("should throw on validation error", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(400, "Invalid price")
      );

      await expect(servicesApi.create(createData)).rejects.toThrow();
    });

    it("should throw on unauthorized", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(403, "Only owners can create services")
      );

      await expect(servicesApi.create(createData)).rejects.toThrow();
    });
  });
});
