/**
 * Notifications API Tests
 * Tests for notification-related API functions
 */
import { notificationsApi } from "../notifications";
import { apiClient } from "../client";
import {
  createMockAxiosResponse,
  createMockAxiosError,
} from "../../__tests__/test-utils";
import type { Notification, NotificationListResponse } from "../../types";

// Mock the apiClient
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockNotification: Notification = {
  id: 1,
  title: "Booking Confirmed",
  body: "Your booking has been confirmed",
  type: "booking",
  isRead: false,
  userId: 1,
  createdAt: "2024-01-01T00:00:00Z",
};

const mockNotificationResponse: NotificationListResponse = {
  data: [mockNotification],
  total: 1,
  page: 1,
  limit: 10,
};

describe("Notifications API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call GET /notification/user without params", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockNotificationResponse)
      );

      await notificationsApi.getAll();

      expect(mockedApiClient.get).toHaveBeenCalledWith("/notification/user", {
        params: undefined,
      });
    });

    it("should call GET /notification/user with pagination", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockNotificationResponse)
      );

      await notificationsApi.getAll({ page: 2, limit: 20 });

      expect(mockedApiClient.get).toHaveBeenCalledWith("/notification/user", {
        params: { page: 2, limit: 20 },
      });
    });

    it("should return notification list response", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockNotificationResponse)
      );

      const result = await notificationsApi.getAll();

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0]).toEqual(mockNotification);
    });

    it("should return empty data when no notifications", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse({ data: [], total: 0, page: 1, limit: 10 })
      );

      const result = await notificationsApi.getAll();

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("should throw on unauthorized", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(401, "Unauthorized")
      );

      await expect(notificationsApi.getAll()).rejects.toThrow();
    });
  });

  describe("markAsRead", () => {
    const notificationId = 1;

    it("should call GET /notification/:id/read", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse({ ...mockNotification, isRead: true })
      );

      await notificationsApi.markAsRead(notificationId);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `/notification/${notificationId}/read`
      );
    });

    it("should return notification with isRead true", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse({ ...mockNotification, isRead: true })
      );

      const result = await notificationsApi.markAsRead(notificationId);

      expect(result.isRead).toBe(true);
    });

    it("should throw on not found", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(404, "Notification not found")
      );

      await expect(notificationsApi.markAsRead(999)).rejects.toThrow();
    });

    it("should throw on forbidden", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(403, "Cannot mark other users notifications")
      );

      await expect(notificationsApi.markAsRead(notificationId)).rejects.toThrow();
    });
  });
});
