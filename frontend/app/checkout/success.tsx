/**
 * Booking Success Screen
 * Confirmation after successful booking
 */
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";

import { bookingsApi } from "@/src/api/bookings";
import { useCartStore, useCartTotalPrice, useCartTotalDuration, useAuthStore } from "@/src/stores";
import { Button } from "@/src/components/ui/button";
import { showToast } from "@/src/components/ui/toast";
import { colors } from "@/src/constants/theme";

export default function BookingSuccessScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);

  const {
    items,
    branchId,
    branchName,
    staffName,
    staffId,
    dateTime,
    clearCart,
  } = useCartStore();
  const totalPrice = useCartTotalPrice();
  const totalDuration = useCartTotalDuration();

  // Store display data before cart is cleared
  const [displayData, setDisplayData] = useState<{
    items: typeof items;
    totalPrice: number;
    branchName: string;
    staffName: string;
    dateTime: string;
  } | null>(null);

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withDelay(300, withSpring(1));
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (cartSnapshot: { items: typeof items; totalDuration: number; totalPrice: number }) => {
      // Parse datetime to get start/end times
      const now = new Date();
      const startAt = now.toISOString();
      const endAt = new Date(now.getTime() + cartSnapshot.totalDuration * 60000).toISOString();

      const requestPayload = {
        startAt,
        endAt,
        totalDuration: cartSnapshot.totalDuration,
        totalPrice: cartSnapshot.totalPrice,
        clientId: user?.id || 0,
        staffId: staffId || 1,
        branchId: branchId || 1,
      };

      console.log("=== BOOKING CREATE DEBUG ===");
      console.log("Request payload:", JSON.stringify(requestPayload, null, 2));

      const booking = await bookingsApi.create(requestPayload);
      console.log("Booking created successfully:", booking);

      // Skip addService for now - backend endpoint has issues
      // Services can be added via backend fix or separate API call

      return booking;
    },
    onSuccess: (data) => {
      console.log("=== BOOKING SUCCESS ===", data);
      showToast("Đặt lịch thành công!", "success");
    },
    onError: (error: Error) => {
      console.error("=== BOOKING ERROR ===", error);
      showToast(error.message || "Không thể tạo lịch hẹn", "error");
    },
  });

  useEffect(() => {
    console.log("=== BOOKING EFFECT ===");
    console.log("items.length:", items.length);
    console.log("user?.id:", user?.id);

    // Wait for valid user ID (not 0) before creating booking
    const hasValidUser = user?.id && user.id > 0;
    if (items.length > 0 && hasValidUser) {
      console.log("Triggering booking creation with userId:", user.id);

      // Capture cart snapshot before clearing
      const cartSnapshot = {
        items: [...items],
        totalDuration,
        totalPrice,
      };

      // Store display data for UI
      setDisplayData({
        items: [...items],
        totalPrice,
        branchName: branchName || "Barbershop",
        staffName: staffName || "Thợ bất kỳ",
        dateTime: dateTime || "",
      });

      // Clear cart immediately to prevent duplicate on re-mount
      clearCart();

      // Create booking with snapshot
      createBookingMutation.mutate(cartSnapshot);
    } else {
      console.log("Skipping - no items or invalid user");
    }
  }, [user?.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleViewBookings = () => {
    router.replace("/(tabs)/bookings" as never);
  };

  const handleBackHome = () => {
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Success Icon */}
        <View className="items-center mb-8">
          <Animated.View
            style={animatedIconStyle}
            className="w-24 h-24 rounded-full bg-success items-center justify-center"
          >
            <Ionicons name="checkmark" size={48} color="white" />
          </Animated.View>

          <Text className="text-success text-2xl font-montserrat-bold mt-4">
            {t("booking.bookingSuccess")}
          </Text>
          <Text className="text-text-secondary text-md font-montserrat-regular mt-2 text-center px-8">
            Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận sớm nhất.
          </Text>
        </View>

        {/* Booking Summary Card */}
        {displayData && (
          <Animated.View
            style={animatedContentStyle}
            className="bg-white mx-4 rounded-xl border-2 border-primary p-4"
          >
            {/* Stylist */}
            <View className="flex-row items-center pb-4 border-b border-border-light">
              <View>
                <Text className="text-primary text-xs font-montserrat-semibold">
                  BARBER
                </Text>
                <Text className="text-primary text-lg font-montserrat-bold mt-1">
                  {displayData.staffName}
                </Text>
              </View>
            </View>

            {/* Date/Time */}
            <View className="flex-row py-4 border-b border-border-light">
              <View className="flex-row items-center flex-1">
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                <Text className="text-text-primary text-md font-montserrat-medium ml-2">
                  {displayData.dateTime?.split(" - ")[0] || "Hôm nay"}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
                <Text className="text-text-primary text-md font-montserrat-medium ml-2">
                  {displayData.dateTime?.split(" - ")[1] || "10:00"}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View className="flex-row items-start py-4 border-b border-border-light">
              <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
              <View className="flex-1 ml-2">
                <Text className="text-primary text-md font-montserrat-semibold">
                  {displayData.branchName}
                </Text>
                <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                  123 Nguyễn Huệ, Quận 1, TP.HCM
                </Text>
              </View>
            </View>

            {/* Services */}
            <View className="py-4 border-b border-border-light">
              {displayData.items.map((item) => (
                <View key={item.service.id} className="flex-row justify-between py-1">
                  <Text className="text-text-primary text-sm font-montserrat-regular">
                    {item.service.name} x{item.quantity}
                  </Text>
                  <Text className="text-text-primary text-sm font-montserrat-medium">
                    {formatPrice(item.service.price * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Total */}
            <View className="flex-row justify-between pt-4">
              <Text className="text-text-primary text-lg font-montserrat-bold">
                Tổng cộng
              </Text>
              <Text className="text-primary text-lg font-montserrat-bold">
                {formatPrice(displayData.totalPrice)}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Actions */}
        <Animated.View style={animatedContentStyle} className="px-4 mt-8 gap-3">
          <Button variant="gradient" onPress={handleViewBookings} fullWidth>
            Xem lịch hẹn
          </Button>
          <Button variant="secondary" onPress={handleBackHome} fullWidth>
            Về trang chủ
          </Button>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
