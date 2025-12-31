/**
 * Empty State Component
 * Placeholder for empty lists and states
 */
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./button";
import { colors } from "@/src/constants/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "file-tray-outline",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="w-20 h-20 rounded-full bg-primary-light items-center justify-center mb-4">
        <Ionicons name={icon} size={40} color={colors.primary} />
      </View>

      <Text className="text-text-primary text-lg font-montserrat-semibold text-center mb-2">
        {title}
      </Text>

      {description && (
        <Text className="text-text-secondary text-sm font-montserrat-regular text-center mb-6">
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

/**
 * Pre-configured empty states
 */
export function EmptyBookings({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="calendar-outline"
      title="Chưa có lịch hẹn"
      description="Bạn chưa đặt lịch hẹn nào. Hãy khám phá và đặt dịch vụ ngay!"
      actionLabel="Khám phá dịch vụ"
      onAction={onAction}
    />
  );
}

export function EmptyFavorites({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="heart-outline"
      title="Chưa có mục yêu thích"
      description="Bạn chưa lưu salon nào vào danh sách yêu thích."
      actionLabel="Khám phá salon"
      onAction={onAction}
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon="notifications-outline"
      title="Không có thông báo"
      description="Bạn chưa có thông báo nào."
    />
  );
}

export function EmptySearchResults({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="search-outline"
      title="Không tìm thấy kết quả"
      description="Hãy thử tìm kiếm với từ khóa khác."
      actionLabel="Xóa bộ lọc"
      onAction={onAction}
    />
  );
}

export function EmptyCart({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="cart-outline"
      title="Giỏ hàng trống"
      description="Bạn chưa chọn dịch vụ nào. Hãy thêm dịch vụ vào giỏ hàng!"
      actionLabel="Xem dịch vụ"
      onAction={onAction}
    />
  );
}

export function EmptyAddresses({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="location-outline"
      title="Chưa có địa chỉ"
      description="Bạn chưa lưu địa chỉ nào. Thêm địa chỉ để đặt lịch dễ dàng hơn!"
      actionLabel="Thêm địa chỉ"
      onAction={onAction}
    />
  );
}
