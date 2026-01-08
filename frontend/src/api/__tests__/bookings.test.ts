/**
 * Bookings API Tests
 * Tests for booking API functions
 */
import { bookingsApi } from "../bookings";
import { apiClient } from "../client";
import {
  mockBooking,
  createMockAxiosResponse,
  createMockAxiosError,
} from "../../__tests__/test-utils";
import type { CreateBookingRequest, BookingStatusAction } from "../../types";

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

describe("Bookings API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    const createData: CreateBookingRequest = {
      startAt: "2024-12-25T10:00:00Z",
      endAt: "2024-12-25T10:30:00Z",
      totalDuration: 30,
      totalPrice: 100000,
      clientId: 1,
      staffId: 2,
      branchId: 1,
    };

    it("should call POST /booking with data", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockBooking)
      );

      await bookingsApi.create(createData);

      expect(mockedApiClient.post).toHaveBeenCalledWith("/booking", createData);
    });

    it("should return created booking on success", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockBooking)
      );

      const result = await bookingsApi.create(createData);

      expect(result).toEqual(mockBooking);
      expect(result.id).toBe(mockBooking.id);
      expect(result.status).toBe("pending");
    });

    it("should throw on validation error", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(400, "Invalid booking data")
      );

      await expect(bookingsApi.create(createData)).rejects.toThrow();
    });

    it("should throw on server error", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(500, "Server error")
      );

      await expect(bookingsApi.create(createData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("should call GET /booking/:id", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockBooking)
      );

      await bookingsApi.getById(1);

      expect(mockedApiClient.get).toHaveBeenCalledWith("/booking/1");
    });

    it("should return booking on success", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockBooking)
      );

      const result = await bookingsApi.getById(1);

      expect(result).toEqual(mockBooking);
      expect(result.id).toBe(1);
    });

    it("should throw on not found", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(404, "Booking not found")
      );

      await expect(bookingsApi.getById(999)).rejects.toThrow();
    });
  });

  describe("getHistory", () => {
    const mockBookings = [mockBooking, { ...mockBooking, id: 2 }];

    it("should call GET /booking/history", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockBookings)
      );

      await bookingsApi.getHistory();

      expect(mockedApiClient.get).toHaveBeenCalledWith("/booking/history", {
        params: undefined,
      });
    });

    it("should call with pagination params when provided", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockBookings)
      );

      await bookingsApi.getHistory({ page: 1, limit: 10 });

      expect(mockedApiClient.get).toHaveBeenCalledWith("/booking/history", {
        params: { page: 1, limit: 10 },
      });
    });

    it("should return bookings array on success", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockBookings)
      );

      const result = await bookingsApi.getHistory();

      expect(result).toEqual(mockBookings);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no bookings", async () => {
      mockedApiClient.get.mockResolvedValueOnce(createMockAxiosResponse([]));

      const result = await bookingsApi.getHistory();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should throw on unauthorized", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(401, "Unauthorized")
      );

      await expect(bookingsApi.getHistory()).rejects.toThrow();
    });
  });

  describe("addService", () => {
    const serviceData = {
      bookingId: 1,
      serviceId: 1,
    };

    it("should call POST /booking-service", async () => {
      mockedApiClient.post.mockResolvedValueOnce(createMockAxiosResponse(null));

      await bookingsApi.addService(serviceData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "/booking-service",
        serviceData
      );
    });

    it("should complete without error on success", async () => {
      mockedApiClient.post.mockResolvedValueOnce(createMockAxiosResponse(null));

      await expect(bookingsApi.addService(serviceData)).resolves.not.toThrow();
    });

    it("should throw on booking not found", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(404, "Booking not found")
      );

      await expect(bookingsApi.addService(serviceData)).rejects.toThrow();
    });
  });

  describe("changeStatus", () => {
    const confirmedBooking = { ...mockBooking, status: "confirmed" as const };

    it.each([
      ["confirm", "/booking/1/status/confirm"],
      ["complete", "/booking/1/status/complete"],
      ["cancel", "/booking/1/status/cancel"],
    ] as [BookingStatusAction, string][])(
      "should call POST /booking/:id/status/%s",
      async (status, expectedUrl) => {
        mockedApiClient.post.mockResolvedValueOnce(
          createMockAxiosResponse(confirmedBooking)
        );

        await bookingsApi.changeStatus(1, status);

        expect(mockedApiClient.post).toHaveBeenCalledWith(expectedUrl);
      }
    );

    it("should return updated booking on confirm", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(confirmedBooking)
      );

      const result = await bookingsApi.changeStatus(1, "confirm");

      expect(result.status).toBe("confirmed");
    });

    it("should return updated booking on complete", async () => {
      const completedBooking = { ...mockBooking, status: "completed" as const };
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(completedBooking)
      );

      const result = await bookingsApi.changeStatus(1, "complete");

      expect(result.status).toBe("completed");
    });

    it("should return updated booking on cancel", async () => {
      const cancelledBooking = { ...mockBooking, status: "cancelled" as const };
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(cancelledBooking)
      );

      const result = await bookingsApi.changeStatus(1, "cancel");

      expect(result.status).toBe("cancelled");
    });

    it("should throw on invalid status transition", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(400, "Invalid status transition")
      );

      await expect(bookingsApi.changeStatus(1, "confirm")).rejects.toThrow();
    });

    it("should throw on not found", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(404, "Booking not found")
      );

      await expect(bookingsApi.changeStatus(999, "confirm")).rejects.toThrow();
    });
  });
});
