/**
 * Toast Component
 * Notification messages with auto-dismiss
 */
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { useEffect } from "react";
import { create } from "zustand";
import { colors } from "@/src/constants/theme";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

// Toast store for global access
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// Helper function to show toast
export const showToast = (
  message: string,
  type: ToastType = "info",
  duration = 3000
) => {
  useToastStore.getState().addToast({ message, type, duration });
};

// Toast configuration
const toastConfig: Record<
  ToastType,
  { icon: keyof typeof Ionicons.glyphMap; bg: string; iconColor: string }
> = {
  success: {
    icon: "checkmark-circle",
    bg: "bg-success-light",
    iconColor: colors.success,
  },
  error: {
    icon: "close-circle",
    bg: "bg-coral-light",
    iconColor: colors.coral,
  },
  warning: {
    icon: "warning",
    bg: "bg-warning-light",
    iconColor: colors.warning,
  },
  info: {
    icon: "information-circle",
    bg: "bg-info-light",
    iconColor: colors.info,
  },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const config = toastConfig[toast.type];
  const duration = toast.duration || 3000;

  useEffect(() => {
    // Animate in
    translateY.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });

    // Animate out after duration
    translateY.value = withDelay(
      duration,
      withTiming(-100, { duration: 300 }, () => {
        runOnJS(onDismiss)();
      })
    );
    opacity.value = withDelay(duration, withTiming(0, { duration: 300 }));
  }, [duration, onDismiss, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle} className="px-4 mb-2">
      <View
        className={`flex-row items-center p-4 rounded-xl ${config.bg} shadow-sm`}
      >
        <Ionicons name={config.icon} size={24} color={config.iconColor} />
        <Text className="flex-1 ml-3 text-text-primary font-montserrat-medium">
          {toast.message}
        </Text>
        <Pressable onPress={onDismiss} className="ml-2">
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

/**
 * Toast Container - Add this to your root layout
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <View className="absolute top-0 left-0 right-0 z-50 pt-12">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </View>
  );
}
