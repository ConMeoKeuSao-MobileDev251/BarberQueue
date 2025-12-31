/**
 * Skeleton Component
 * Loading placeholder with shimmer animation
 */
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 4,
  className = "",
}: SkeletonProps) {
  const translateX = useSharedValue(-100);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(100, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }));

  return (
    <View
      className={`bg-gray-200 overflow-hidden ${className}`}
      style={{
        width: typeof width === "number" ? width : undefined,
        height,
        borderRadius,
      }}
    >
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

/**
 * Common skeleton patterns
 */
export function SkeletonCard() {
  return (
    <View className="bg-white rounded-xl p-4 gap-3">
      <View className="flex-row gap-3">
        <Skeleton width={80} height={80} borderRadius={12} />
        <View className="flex-1 gap-2">
          <Skeleton height={20} />
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonListItem() {
  return (
    <View className="flex-row items-center gap-3 p-4 bg-white">
      <Skeleton width={48} height={48} borderRadius={24} />
      <View className="flex-1 gap-2">
        <Skeleton height={18} />
        <Skeleton width="70%" height={14} />
      </View>
    </View>
  );
}

export function SkeletonServiceCard() {
  return (
    <View className="bg-white rounded-xl overflow-hidden">
      <Skeleton height={120} borderRadius={0} />
      <View className="p-3 gap-2">
        <Skeleton height={18} />
        <Skeleton width="50%" height={14} />
        <View className="flex-row justify-between mt-2">
          <Skeleton width={80} height={20} />
          <Skeleton width={60} height={14} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonShopCard() {
  return (
    <View className="bg-white rounded-xl overflow-hidden">
      <Skeleton height={150} borderRadius={0} />
      <View className="p-4 gap-2">
        <Skeleton height={20} />
        <Skeleton width="80%" height={14} />
        <View className="flex-row items-center gap-2 mt-1">
          <Skeleton width={60} height={16} />
          <Skeleton width={40} height={14} />
        </View>
      </View>
    </View>
  );
}
