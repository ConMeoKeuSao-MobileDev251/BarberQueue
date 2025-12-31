/**
 * Order Details Screen
 * View detailed booking/order information with price breakdown
 */
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { bookingsApi } from "@/src/api/bookings";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { Avatar } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { SkeletonCard } from "@/src/components/ui/skeleton";
import { colors } from "@/src/constants/theme";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Fetch booking details
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingsApi.getById(parseInt(id || "0")),
    enabled: !!id,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = (status: string): "success" | "error" | "primary" | "warning" | "info" | "neutral" => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "confirmed":
        return "info";
      case "pending":
        return "warning";
      default:
        return "neutral";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      default:
        return status;
    }
  };

  const handleReorder = () => {
    // Navigate to shop to rebook
    router.push("/(tabs)" as never);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-secondary">
        <ScreenHeader title={t("booking.orderDetails")} />
        <View className="p-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  if (!booking) {
    return (
      <View className="flex-1 bg-background-secondary">
        <ScreenHeader title={t("booking.orderDetails")} />
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="alert-circle-outline" size={64} color={colors.textTertiary} />
          <Text className="text-text-secondary text-lg font-montserrat-medium mt-4">
            Không tìm thấy đơn hàng
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title={t("booking.orderDetails")} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Status Badge */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-text-secondary text-sm font-montserrat-regular">
              Trạng thái
            </Text>
            <Badge variant={getStatusVariant(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
          </View>
        </View>

        {/* Shop & Stylist Info */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <Text className="text-text-primary text-lg font-montserrat-bold">
            Barbershop
          </Text>

          <View className="flex-row items-center mt-3 pt-3 border-t border-border-light">
            <Avatar source={null} name={booking.staff?.fullName || "Stylist"} size="md" />
            <View className="flex-1 ml-3">
              <Text className="text-text-secondary text-sm font-montserrat-regular">
                Thợ cắt tóc
              </Text>
              <Text className="text-text-primary text-md font-montserrat-medium">
                {booking.staff?.fullName || "Thợ bất kỳ"}
              </Text>
            </View>
          </View>

          {/* Date & Time */}
          <View className="flex-row mt-3 pt-3 border-t border-border-light">
            <View className="flex-row items-center flex-1">
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text className="text-text-primary text-md font-montserrat-medium ml-2">
                {formatDate(booking.startAt)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text className="text-text-primary text-md font-montserrat-medium ml-2">
                {formatTime(booking.startAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Services Breakdown */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <Text className="text-text-primary text-md font-montserrat-semibold mb-3">
            Chi tiết dịch vụ
          </Text>

          {booking.services?.map((service, index) => (
            <View
              key={service.id}
              className={`flex-row items-center py-3 ${
                index < (booking.services?.length || 0) - 1 ? "border-b border-border-light" : ""
              }`}
            >
              <View className="flex-1">
                <Text className="text-text-primary text-md font-montserrat-medium">
                  {service.name}
                </Text>
                <Text className="text-text-tertiary text-sm font-montserrat-regular mt-1">
                  {service.duration} phút
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-teal-100 px-2 py-1 rounded-md mr-3">
                  <Text className="text-teal-700 text-xs font-montserrat-medium">x1</Text>
                </View>
                <Text className="text-text-primary text-md font-montserrat-medium">
                  {formatPrice(service.price)}
                </Text>
              </View>
            </View>
          ))}

          {/* If no services, show placeholder */}
          {(!booking.services || booking.services.length === 0) && (
            <Text className="text-text-tertiary text-sm font-montserrat-regular py-3">
              Không có thông tin dịch vụ
            </Text>
          )}
        </View>

        {/* Price Summary */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <Text className="text-text-primary text-md font-montserrat-semibold mb-3">
            Thanh toán
          </Text>

          <View className="flex-row justify-between py-2">
            <Text className="text-text-secondary text-md font-montserrat-regular">
              Tạm tính
            </Text>
            <Text className="text-text-primary text-md font-montserrat-medium">
              {formatPrice(booking.totalPrice)}
            </Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-text-secondary text-md font-montserrat-regular">
              Giảm giá
            </Text>
            <Text className="text-success text-md font-montserrat-medium">
              -0đ
            </Text>
          </View>

          <View className="flex-row justify-between py-3 border-t border-border-light mt-2">
            <Text className="text-text-primary text-lg font-montserrat-bold">
              Tổng cộng
            </Text>
            <Text className="text-primary text-lg font-montserrat-bold">
              {formatPrice(booking.totalPrice)}
            </Text>
          </View>
        </View>

        {/* Order Info */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <Text className="text-text-primary text-md font-montserrat-semibold mb-3">
            Thông tin đơn hàng
          </Text>

          <View className="flex-row justify-between py-2">
            <Text className="text-text-secondary text-md font-montserrat-regular">
              Mã đơn hàng
            </Text>
            <Text className="text-text-primary text-md font-montserrat-medium">
              #{booking.id}
            </Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-text-secondary text-md font-montserrat-regular">
              Ngày đặt
            </Text>
            <Text className="text-text-primary text-md font-montserrat-medium">
              {formatDate(booking.createdAt)}
            </Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-text-secondary text-md font-montserrat-regular">
              Phương thức thanh toán
            </Text>
            <Text className="text-text-primary text-md font-montserrat-medium">
              Tiền mặt
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      {(booking.status === "completed" || booking.status === "cancelled") && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 border-t border-border-light"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Button variant="gradient" onPress={handleReorder} fullWidth>
            Đặt lại đơn hàng
          </Button>
        </View>
      )}
    </View>
  );
}
