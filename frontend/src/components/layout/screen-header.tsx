/**
 * Screen Header Component
 * Consistent header with back button and actions
 */
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/constants/theme";
import { ReactNode } from "react";

interface ScreenHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: ReactNode;
  transparent?: boolean;
  centerTitle?: boolean;
}

export function ScreenHeader({
  title,
  showBackButton = true,
  onBackPress,
  rightAction,
  transparent = false,
  centerTitle = true,
}: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      className={`${transparent ? "" : "bg-white border-b border-border-light"}`}
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center h-14 px-4">
        {/* Left section - Back button */}
        <View className="w-10">
          {showBackButton && (
            <Pressable
              onPress={handleBack}
              className="w-10 h-10 items-center justify-center rounded-full"
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.backgroundSecondary : "transparent",
              })}
            >
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </Pressable>
          )}
        </View>

        {/* Center section - Title */}
        <View className={`flex-1 ${centerTitle ? "items-center" : "ml-2"}`}>
          {title && (
            <Text
              className="text-lg font-montserrat-semibold text-text-primary"
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>

        {/* Right section - Actions */}
        <View className="w-10 items-end">{rightAction}</View>
      </View>
    </View>
  );
}

/**
 * Large Header with subtitle
 */
interface LargeHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: ReactNode;
}

export function LargeHeader({ title, subtitle, rightAction }: LargeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-white px-4 pb-4" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-montserrat-bold text-text-primary">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm font-montserrat-regular text-text-secondary mt-1">
              {subtitle}
            </Text>
          )}
        </View>
        {rightAction && <View className="ml-4">{rightAction}</View>}
      </View>
    </View>
  );
}
