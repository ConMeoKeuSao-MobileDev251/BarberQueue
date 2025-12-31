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
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";

import { bookingsApi } from "@/src/api/bookings";
import { useCartStore, useAuthStore } from "@/src/stores";
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
    branchName,
    staffName,
    staffId,
    dateTime,
    totalPrice,
    totalDuration,
    clearCart,
  } = useCartStore();

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
    mutationFn: async () => {
      // Parse datetime to get start/end times
      const now = new Date();
      const startAt = now.toISOString();
      const endAt = new Date(now.getTime() + totalDuration * 60000).toISOString();

      const booking = await bookingsApi.create({
        status: "pending",
        startAt,
        endAt,
        totalDuration,
        totalPrice,
        clientId: user?.id || 0,
        staffId: staffId || 1,
      });

      // Associate services with booking
      for (const item of items) {
        await bookingsApi.addService({
          bookingId: booking.id,
          serviceId: item.service.id,
        });
      }

      return booking;
    },
    onSuccess: () => {
      clearCart();
    },
    onError: (error: Error) => {
      showToast(error.message || "Không thể tạo lịch hẹn", "error");
    },
  });

  useEffect(() => {
    if (items.length > 0 && !createBookingMutation.isPending && !createBookingMutation.isSuccess) {
      createBookingMutation.mutate();
    }
  }, []);

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
                {staffName || "Thợ bất kỳ"}
              </Text>
            </View>
          </View>

          {/* Date/Time */}
          <View className="flex-row py-4 border-b border-border-light">
            <View className="flex-row items-center flex-1">
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text className="text-text-primary text-md font-montserrat-medium ml-2">
                {dateTime?.split(" - ")[0] || "Hôm nay"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text className="text-text-primary text-md font-montserrat-medium ml-2">
                {dateTime?.split(" - ")[1] || "10:00"}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View className="flex-row items-start py-4 border-b border-border-light">
            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
            <View className="flex-1 ml-2">
              <Text className="text-primary text-md font-montserrat-semibold">
                {branchName || "Barbershop"}
              </Text>
              <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                123 Nguyễn Huệ, Quận 1, TP.HCM
              </Text>
            </View>
          </View>

          {/* Services */}
          <View className="py-4 border-b border-border-light">
            {items.map((item) => (
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
              {formatPrice(totalPrice)}
            </Text>
          </View>
        </Animated.View>

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
