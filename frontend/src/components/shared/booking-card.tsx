/**
 * Booking Card Component
 * Displays a booking with status, date, shop, and services
 */
import { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@/src/components/ui/avatar";
import { StatusBadge } from "@/src/components/ui/badge";
import { colors } from "@/src/constants/theme";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface BookingService {
  id: string;
  name: string;
  price: number;
}

interface BookingCardProps {
  id: string;
  shopName: string;
  shopImage?: string | null;
  status: BookingStatus;
  date: string; // ISO date string
  time: string; // HH:mm format
  services: BookingService[];
  totalPrice: number;
  onPress?: () => void;
  onCancel?: () => void;
  onRebook?: () => void;
}

function BookingCardComponent({
  shopName,
  shopImage,
  status,
  date,
  time,
  services,
  totalPrice,
  onPress,
  onCancel,
  onRebook,
}: BookingCardProps) {
  const formatDate = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const day = weekdays[d.getDay()];
    return `${day}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }, []);

  const formatPrice = useCallback((amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  }, []);

  const canCancel = status === "pending" || status === "confirmed";
  const canRebook = status === "completed" || status === "cancelled";

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl overflow-hidden shadow-sm"
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-border-light">
        <Avatar source={shopImage} name={shopName} size="md" />
        <View className="flex-1 ml-3">
          <Text className="text-md font-montserrat-semibold text-text-primary" numberOfLines={1}>
            {shopName}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text className="text-sm font-montserrat-regular text-text-secondary ml-1">
              {formatDate(date)} • {time}
            </Text>
          </View>
        </View>
        <StatusBadge status={status} />
      </View>

      {/* Services */}
      <View className="p-4 border-b border-border-light">
        {services.slice(0, 3).map((service, index) => (
          <View key={service.id} className={`flex-row justify-between ${index > 0 ? "mt-2" : ""}`}>
            <Text className="text-sm font-montserrat-regular text-text-secondary flex-1" numberOfLines={1}>
              {service.name}
            </Text>
            <Text className="text-sm font-montserrat-medium text-text-primary ml-2">
              {formatPrice(service.price)}
            </Text>
          </View>
        ))}
        {services.length > 3 && (
          <Text className="text-xs font-montserrat-regular text-text-tertiary mt-2">
            +{services.length - 3} dịch vụ khác
          </Text>
        )}
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between p-4">
        <View>
          <Text className="text-xs font-montserrat-regular text-text-tertiary">Tổng cộng</Text>
          <Text className="text-lg font-montserrat-bold text-primary">
            {formatPrice(totalPrice)}
          </Text>
        </View>

        <View className="flex-row gap-2">
          {canCancel && onCancel && (
            <Pressable
              onPress={onCancel}
              className="px-4 py-2 rounded-lg border border-coral"
            >
              <Text className="text-sm font-montserrat-medium text-coral">Hủy</Text>
            </Pressable>
          )}
          {canRebook && onRebook && (
            <Pressable
              onPress={onRebook}
              className="px-4 py-2 rounded-lg bg-primary"
            >
              <Text className="text-sm font-montserrat-medium text-white">Đặt lại</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// Memoized export for performance optimization
export const BookingCard = memo(BookingCardComponent);

/**
 * Compact Booking Card for lists
 */
interface CompactBookingCardProps {
  id: string;
  shopName: string;
  shopImage?: string | null;
  status: BookingStatus;
  date: string;
  time: string;
  serviceCount: number;
  totalPrice: number;
  onPress?: () => void;
}

function CompactBookingCardComponent({
  shopName,
  shopImage,
  status,
  date,
  time,
  serviceCount,
  totalPrice,
  onPress,
}: CompactBookingCardProps) {
  const formatDate = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }, []);

  const formatPrice = useCallback((amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  }, []);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-white rounded-xl p-4 shadow-sm"
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
      })}
      accessibilityRole="button"
      accessibilityLabel={`Đặt lịch tại ${shopName}, ${formatDate(date)} lúc ${time}`}
    >
      <Avatar source={shopImage} name={shopName} size="md" />

      <View className="flex-1 ml-3">
        <Text className="text-sm font-montserrat-semibold text-text-primary" numberOfLines={1}>
          {shopName}
        </Text>
        <Text className="text-xs font-montserrat-regular text-text-secondary mt-1">
          {formatDate(date)} • {time} • {serviceCount} dịch vụ
        </Text>
      </View>

      <View className="items-end">
        <StatusBadge status={status} />
        <Text className="text-sm font-montserrat-bold text-primary mt-1">
          {formatPrice(totalPrice)}
        </Text>
      </View>
    </Pressable>
  );
}

// Memoized export for performance optimization
export const CompactBookingCard = memo(CompactBookingCardComponent);
