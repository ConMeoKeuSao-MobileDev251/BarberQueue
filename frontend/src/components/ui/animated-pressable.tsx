/**
 * Animated Pressable Component
 * Pressable with scale animation and haptic feedback
 */
import { ReactNode, useCallback, useEffect } from "react";
import { Pressable, PressableProps, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { lightHaptic, mediumHaptic, selectionHaptic } from "@/src/utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableComponentProps extends Omit<PressableProps, "style"> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  scaleValue?: number;
  hapticType?: "none" | "light" | "medium" | "selection";
  animationType?: "scale" | "opacity" | "both";
}

export function AnimatedPressableComponent({
  children,
  style,
  className,
  onPressIn,
  onPressOut,
  onPress,
  scaleValue = 0.97,
  hapticType = "light",
  animationType = "scale",
  disabled,
  ...props
}: AnimatedPressableComponentProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]) => {
      if (animationType === "scale" || animationType === "both") {
        scale.value = withSpring(scaleValue, {
          damping: 15,
          stiffness: 400,
        });
      }
      if (animationType === "opacity" || animationType === "both") {
        opacity.value = withTiming(0.7, { duration: 100 });
      }
      onPressIn?.(e);
    },
    [scale, opacity, scaleValue, animationType, onPressIn]
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]) => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 400,
      });
      opacity.value = withTiming(1, { duration: 100 });
      onPressOut?.(e);
    },
    [scale, opacity, onPressOut]
  );

  const handlePress = useCallback(
    async (e: Parameters<NonNullable<PressableProps["onPress"]>>[0]) => {
      // Trigger haptic feedback
      if (hapticType === "light") {
        await lightHaptic();
      } else if (hapticType === "medium") {
        await mediumHaptic();
      } else if (hapticType === "selection") {
        await selectionHaptic();
      }
      onPress?.(e);
    },
    [hapticType, onPress]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      style={[animatedStyle, style]}
      className={className}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}

/**
 * Animated Card Component
 * Card wrapper with press animation
 */
interface AnimatedCardProps extends AnimatedPressableComponentProps {
  elevated?: boolean;
}

export function AnimatedCard({
  children,
  elevated = false,
  className = "",
  ...props
}: AnimatedCardProps) {
  return (
    <AnimatedPressableComponent
      className={`bg-white rounded-xl ${elevated ? "shadow-md" : ""} ${className}`}
      scaleValue={0.98}
      hapticType="light"
      {...props}
    >
      {children}
    </AnimatedPressableComponent>
  );
}

/**
 * Entrance Animation Wrapper
 * Fade in and slide up animation for list items
 */
interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function FadeInView({
  children,
  delay = 0,
  duration = 300,
  className,
  style,
}: FadeInViewProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration });
      translateY.value = withTiming(0, { duration });
    }, delay);

    return () => clearTimeout(timeout);
  }, [opacity, translateY, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={className}>
      {children}
    </Animated.View>
  );
}

/**
 * Staggered List Animation
 * Animate list items with staggered delays
 */
interface StaggeredItemProps {
  children: ReactNode;
  index: number;
  staggerDelay?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function StaggeredItem({
  children,
  index,
  staggerDelay = 50,
  className,
  style,
}: StaggeredItemProps) {
  return (
    <FadeInView delay={index * staggerDelay} className={className} style={style}>
      {children}
    </FadeInView>
  );
}
