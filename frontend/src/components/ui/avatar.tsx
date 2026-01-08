/**
 * Avatar Component
 * Circular avatar with fallback SVG icon
 */
import { View } from "react-native";
import { Image } from "expo-image";
import { colors } from "@/src/constants/theme";
import { UserProfileIcon } from "@/src/components/icons/user-profile-icon";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  source?: string | null;
  /** @deprecated No longer used - SVG icon shown instead of initials */
  name?: string;
  size?: AvatarSize;
  showBorder?: boolean;
}

const sizeStyles = {
  sm: { container: "w-8 h-8" },
  md: { container: "w-12 h-12" },
  lg: { container: "w-16 h-16" },
  xl: { container: "w-20 h-20" },
};

const sizePx = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

export function Avatar({
  source,
  size = "md",
  showBorder = false,
}: AvatarProps) {
  const { container } = sizeStyles[size];
  const borderStyle = showBorder ? "border-2 border-white" : "";

  // Show image if source exists
  if (source) {
    return (
      <View className={`${container} rounded-full overflow-hidden ${borderStyle}`}>
        <Image
          source={{ uri: source }}
          style={{ width: sizePx[size], height: sizePx[size] }}
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  // Fallback to SVG user profile icon
  return (
    <View
      className={`${container} rounded-full items-center justify-center ${borderStyle}`}
      style={{ backgroundColor: colors.primaryLight }}
    >
      <UserProfileIcon size={sizePx[size] * 0.6} color={colors.primary} />
    </View>
  );
}
