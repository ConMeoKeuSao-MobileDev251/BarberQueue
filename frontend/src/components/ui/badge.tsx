/**
 * Badge Component
 * Status badges and tags
 */
import { View, Text } from "react-native";

type BadgeVariant = "primary" | "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantStyles = {
  primary: { bg: "bg-primary-light", text: "text-primary" },
  success: { bg: "bg-success-light", text: "text-success" },
  warning: { bg: "bg-warning-light", text: "text-warning" },
  error: { bg: "bg-coral-light", text: "text-coral" },
  info: { bg: "bg-info-light", text: "text-info" },
  neutral: { bg: "bg-gray-100", text: "text-text-secondary" },
};

const sizeStyles = {
  sm: { container: "px-2 py-0.5", text: "text-xs" },
  md: { container: "px-3 py-1", text: "text-sm" },
};

export function Badge({ children, variant = "primary", size = "sm" }: BadgeProps) {
  const { bg, text } = variantStyles[variant];
  const { container, text: textSize } = sizeStyles[size];

  return (
    <View className={`${bg} ${container} rounded-sm`}>
      <Text className={`${text} ${textSize} font-montserrat-medium`}>
        {children}
      </Text>
    </View>
  );
}

/**
 * Status Badge for booking status
 */
type StatusType = "pending" | "confirmed" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: StatusType;
}

const statusConfig: Record<StatusType, { label: string; variant: BadgeVariant }> = {
  pending: { label: "Chờ xác nhận", variant: "warning" },
  confirmed: { label: "Đã xác nhận", variant: "info" },
  completed: { label: "Hoàn thành", variant: "success" },
  cancelled: { label: "Đã hủy", variant: "neutral" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
