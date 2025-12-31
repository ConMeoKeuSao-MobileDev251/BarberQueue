/**
 * Bottom Sheet Component
 * Modal sheet that slides up from bottom
 */
import { View, Text, Pressable, Modal, Dimensions } from "react-native";
import { ReactNode } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapPoints?: number[]; // Heights as percentages [0.25, 0.5, 0.9]
  showHandle?: boolean;
  showCloseButton?: boolean;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.5],
  showHandle = true,
  showCloseButton = true,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });
  const maxHeight = SCREEN_HEIGHT * Math.max(...snapPoints);

  const scrollTo = (destination: number) => {
    "worklet";
    translateY.value = withSpring(destination, { damping: 50 });
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        event.translationY + context.value.y,
        0
      );
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        scrollTo(SCREEN_HEIGHT);
        runOnJS(onClose)();
      } else {
        scrollTo(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
  }));

  // Animate in when visible changes
  if (visible) {
    translateY.value = withSpring(0, { damping: 50 });
  } else {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View
        style={backdropStyle}
        className="absolute inset-0 bg-black/50"
      >
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            animatedStyle,
            {
              maxHeight,
              paddingBottom: insets.bottom,
            },
          ]}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        >
          {/* Handle */}
          {showHandle && (
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 rounded-full bg-gray-300" />
            </View>
          )}

          {/* Header */}
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border-light">
              <Text className="text-lg font-montserrat-semibold text-text-primary">
                {title}
              </Text>
              {showCloseButton && (
                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>
          )}

          {/* Content */}
          <View className="flex-1">{children}</View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

/**
 * Action Sheet - Bottom sheet with action buttons
 */
interface ActionSheetOption {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  options: ActionSheetOption[];
}

export function ActionSheet({ visible, onClose, title, options }: ActionSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title={title} snapPoints={[0.4]}>
      <View className="p-4 gap-2">
        {options.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => {
              option.onPress();
              onClose();
            }}
            className="flex-row items-center py-4 px-4 rounded-xl bg-background-secondary"
          >
            {option.icon && (
              <Ionicons
                name={option.icon}
                size={22}
                color={option.destructive ? colors.coral : colors.textPrimary}
              />
            )}
            <Text
              className={`flex-1 ml-3 text-md font-montserrat-medium ${
                option.destructive ? "text-coral" : "text-text-primary"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}
