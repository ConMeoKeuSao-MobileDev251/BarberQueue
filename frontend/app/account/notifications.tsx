/**
 * Notifications Screen
 * View and manage notifications with API integration
 */
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationsApi } from "@/src/api/notifications";
import type { Notification, NotificationType } from "@/src/types";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { EmptyState } from "@/src/components/ui/empty-state";
import { colors } from "@/src/constants/theme";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.getAll({ page: 1, limit: 50 }),
  });

  const notifications = notificationsData?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleMarkAsRead = (id: number) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification && !notification.isRead) {
      markAsReadMutation.mutate(id);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    for (const notification of unreadNotifications) {
      await notificationsApi.markAsRead(notification.id);
    }
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const getNotificationIcon = (type: NotificationType): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "booking":
        return "calendar";
      case "system":
        return "settings";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: NotificationType): string => {
    switch (type) {
      case "booking":
        return colors.primary;
      case "system":
        return colors.textSecondary;
      default:
        return colors.primary;
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Vừa xong";
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader
        title={t("account.notifications")}
        rightAction={
          unreadCount > 0 ? (
            <Pressable onPress={handleMarkAllAsRead} className="p-2">
              <Text className="text-primary text-sm font-montserrat-medium">
                Đọc tất cả
              </Text>
            </Pressable>
          ) : undefined
        }
      />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-text-secondary text-sm font-montserrat-regular">
            Đang tải...
          </Text>
        </View>
      ) : notifications.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <View className="mx-4 mt-4 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-primary mr-2" />
              <Text className="text-text-secondary text-sm font-montserrat-medium">
                {unreadCount} thông báo chưa đọc
              </Text>
            </View>
          )}

          {/* Notifications List */}
          <View className="bg-white mt-4">
            {notifications.map((notification: Notification, index: number) => (
              <Pressable
                key={notification.id}
                onPress={() => handleMarkAsRead(notification.id)}
                className={`flex-row px-4 py-4 ${
                  index < notifications.length - 1 ? "border-b border-border-light" : ""
                } ${!notification.isRead ? "bg-primary-light/30" : ""}`}
              >
                {/* Icon */}
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${getNotificationColor(notification.type)}20` }}
                >
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type)}
                  />
                </View>

                {/* Content */}
                <View className="flex-1 ml-3">
                  <View className="flex-row items-start justify-between">
                    <Text
                      className={`flex-1 text-md ${
                        notification.isRead
                          ? "text-text-primary font-montserrat-medium"
                          : "text-text-primary font-montserrat-bold"
                      }`}
                    >
                      {notification.title}
                    </Text>
                    {!notification.isRead && (
                      <View className="w-2 h-2 rounded-full bg-primary ml-2 mt-2" />
                    )}
                  </View>
                  <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                    {notification.message}
                  </Text>
                  <Text className="text-text-tertiary text-xs font-montserrat-regular mt-2">
                    {formatTimestamp(notification.createdAt)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center">
          <EmptyState
            icon="notifications-off-outline"
            title="Không có thông báo"
            description="Bạn sẽ nhận thông báo về lịch hẹn và ưu đãi tại đây"
          />
        </View>
      )}
    </View>
  );
}
