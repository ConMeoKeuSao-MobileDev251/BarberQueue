/**
 * Notifications Screen
 * View and manage notifications (UI only)
 */
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { ScreenHeader } from "@/src/components/layout/screen-header";
import { EmptyState } from "@/src/components/ui/empty-state";
import { colors } from "@/src/constants/theme";

interface Notification {
  id: string;
  type: "booking" | "promo" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "Lịch hẹn sắp đến",
    message: "Bạn có lịch hẹn cắt tóc vào 14:00 hôm nay tại Barbershop Premium.",
    timestamp: "1 giờ trước",
    isRead: false,
  },
  {
    id: "2",
    type: "promo",
    title: "Ưu đãi đặc biệt! 🎉",
    message: "Giảm 20% cho tất cả dịch vụ trong tuần này. Đặt ngay!",
    timestamp: "3 giờ trước",
    isRead: false,
  },
  {
    id: "3",
    type: "booking",
    title: "Đặt lịch thành công",
    message: "Bạn đã đặt lịch thành công với thợ Minh Tuấn vào T2, 30/12.",
    timestamp: "Hôm qua",
    isRead: true,
  },
  {
    id: "4",
    type: "system",
    title: "Cập nhật ứng dụng",
    message: "Phiên bản mới đã sẵn sàng với nhiều tính năng hấp dẫn.",
    timestamp: "2 ngày trước",
    isRead: true,
  },
  {
    id: "5",
    type: "promo",
    title: "Happy New Year! 🎊",
    message: "Chúc mừng năm mới! Nhận ngay voucher 50K cho đơn từ 200K.",
    timestamp: "3 ngày trước",
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: Notification["type"]): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "booking":
        return "calendar";
      case "promo":
        return "pricetag";
      case "system":
        return "settings";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: Notification["type"]): string => {
    switch (type) {
      case "booking":
        return colors.primary;
      case "promo":
        return colors.success;
      case "system":
        return colors.textSecondary;
      default:
        return colors.primary;
    }
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

      {notifications.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
            {notifications.map((notification, index) => (
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
                    {notification.timestamp}
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
