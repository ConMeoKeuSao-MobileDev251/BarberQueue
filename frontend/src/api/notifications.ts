/**
 * Notifications API Functions
 */
import { apiClient } from "./client";
import type {
  Notification,
  NotificationListResponse,
  PaginationQuery,
} from "../types";

export const notificationsApi = {
  /**
   * Get user notifications (paginated)
   */
  getAll: async (params?: PaginationQuery): Promise<NotificationListResponse> => {
    const response = await apiClient.get<NotificationListResponse>(
      "/notification/user",
      { params }
    );
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: number): Promise<Notification> => {
    const response = await apiClient.get<Notification>(
      `/notification/${id}/read`
    );
    return response.data;
  },
};
