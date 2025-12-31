/**
 * Loading Overlay Component
 * Full-screen loading indicator
 */
import { View, Text, ActivityIndicator, Modal } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { colors } from "@/src/constants/theme";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
}

export function LoadingOverlay({
  visible,
  message,
  transparent = false,
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      accessibilityViewIsModal
      accessibilityLabel={message || "Đang tải"}
    >
      <View
        className={`flex-1 items-center justify-center ${
          transparent ? "bg-black/30" : "bg-white"
        }`}
      >
        <View className="bg-white rounded-2xl p-6 items-center shadow-lg">
          <ActivityIndicator size="large" color={colors.primary} />
          {message && (
            <Text className="text-text-secondary text-sm font-montserrat-regular mt-4">
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

/**
 * Inline Loading Spinner
 * For use within components
 */
interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  message?: string;
}

export function LoadingSpinner({
  size = "large",
  color = colors.primary,
  message,
}: LoadingSpinnerProps) {
  return (
    <View
      className="flex-1 items-center justify-center py-8"
      accessibilityLabel={message || "Đang tải"}
      accessibilityRole="progressbar"
    >
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="text-text-secondary text-sm font-montserrat-regular mt-3">
          {message}
        </Text>
      )}
    </View>
  );
}

/**
 * Pulsing Dot Loader
 * Animated dots for loading indication
 */
export function PulsingDots() {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);

  useEffect(() => {
    const duration = 400;
    const delay = 150;

    scale1.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration, easing: Easing.ease }),
        withTiming(1, { duration, easing: Easing.ease })
      ),
      -1
    );

    setTimeout(() => {
      scale2.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration, easing: Easing.ease }),
          withTiming(1, { duration, easing: Easing.ease })
        ),
        -1
      );
    }, delay);

    setTimeout(() => {
      scale3.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration, easing: Easing.ease }),
          withTiming(1, { duration, easing: Easing.ease })
        ),
        -1
      );
    }, delay * 2);
  }, [scale1, scale2, scale3]);

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
  }));

  return (
    <View
      className="flex-row items-center justify-center gap-2 py-4"
      accessibilityLabel="Đang tải"
      accessibilityRole="progressbar"
    >
      <Animated.View
        style={dot1Style}
        className="w-3 h-3 rounded-full bg-primary"
      />
      <Animated.View
        style={dot2Style}
        className="w-3 h-3 rounded-full bg-primary"
      />
      <Animated.View
        style={dot3Style}
        className="w-3 h-3 rounded-full bg-primary"
      />
    </View>
  );
}

/**
 * Pull to Refresh Indicator
 * Custom refresh control content
 */
interface RefreshIndicatorProps {
  refreshing: boolean;
  message?: string;
}

export function RefreshIndicator({
  refreshing,
  message = "Kéo xuống để làm mới",
}: RefreshIndicatorProps) {
  if (!refreshing) {
    return (
      <View className="items-center py-4">
        <Text className="text-text-tertiary text-xs font-montserrat-regular">
          {message}
        </Text>
      </View>
    );
  }

  return (
    <View className="items-center py-4">
      <ActivityIndicator size="small" color={colors.primary} />
      <Text className="text-text-secondary text-xs font-montserrat-regular mt-2">
        Đang làm mới...
      </Text>
    </View>
  );
}
