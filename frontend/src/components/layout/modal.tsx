/**
 * Modal Component
 * Centered modal dialog
 */
import { View, Text, Pressable, Modal as RNModal } from "react-native";
import { ReactNode } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/src/components/ui/button";
import { colors } from "@/src/constants/theme";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalProps) {
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(visible ? 1 : 0.9, { damping: 20 }) }],
    opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
  }));

  return (
    <RNModal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={backdropStyle} className="absolute inset-0 bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-6">
        <Animated.View
          style={contentStyle}
          className="w-full bg-white rounded-2xl overflow-hidden max-w-sm"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between p-4 border-b border-border-light">
              <Text className="text-lg font-montserrat-semibold text-text-primary flex-1">
                {title}
              </Text>
              {showCloseButton && (
                <Pressable onPress={onClose} className="ml-2">
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>
          )}

          {/* Body */}
          <View className="p-4">{children}</View>
        </Animated.View>
      </View>
    </RNModal>
  );
}

/**
 * Confirmation Dialog
 */
interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  destructive = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} onClose={onClose} showCloseButton={false}>
      <View className="items-center">
        {/* Icon */}
        <View
          className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
            destructive ? "bg-coral-light" : "bg-primary-light"
          }`}
        >
          <Ionicons
            name={destructive ? "warning" : "help-circle"}
            size={32}
            color={destructive ? colors.coral : colors.primary}
          />
        </View>

        {/* Title */}
        <Text className="text-lg font-montserrat-semibold text-text-primary text-center mb-2">
          {title}
        </Text>

        {/* Message */}
        <Text className="text-sm font-montserrat-regular text-text-secondary text-center mb-6">
          {message}
        </Text>

        {/* Actions */}
        <View className="flex-row gap-3 w-full">
          <View className="flex-1">
            <Button variant="secondary" onPress={onClose} disabled={loading}>
              {cancelLabel}
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant={destructive ? "destructive" : "primary"}
              onPress={onConfirm}
              loading={loading}
            >
              {confirmLabel}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Success Modal
 */
interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessModal({
  visible,
  onClose,
  title,
  message,
  actionLabel = "Đóng",
  onAction,
}: SuccessModalProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} showCloseButton={false}>
      <View className="items-center">
        {/* Success Icon */}
        <View className="w-20 h-20 rounded-full bg-success-light items-center justify-center mb-4">
          <Ionicons name="checkmark-circle" size={48} color={colors.success} />
        </View>

        {/* Title */}
        <Text className="text-xl font-montserrat-bold text-text-primary text-center mb-2">
          {title}
        </Text>

        {/* Message */}
        {message && (
          <Text className="text-sm font-montserrat-regular text-text-secondary text-center mb-6">
            {message}
          </Text>
        )}

        {/* Action */}
        <View className="w-full">
          <Button variant="primary" onPress={handleAction}>
            {actionLabel}
          </Button>
        </View>
      </View>
    </Modal>
  );
}
