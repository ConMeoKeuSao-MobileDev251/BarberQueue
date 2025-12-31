/**
 * Avatar Component
 * Circular avatar with fallback initials
 */
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { colors } from "@/src/constants/theme";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  showBorder?: boolean;
}

const sizeStyles = {
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-12 h-12", text: "text-sm" },
  lg: { container: "w-16 h-16", text: "text-lg" },
  xl: { container: "w-20 h-20", text: "text-xl" },
};

const sizePx = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

export function Avatar({
  source,
  name = "",
  size = "md",
  showBorder = false,
}: AvatarProps) {
  // Get initials from name
  const getInitials = (name: string): string => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const { container, text } = sizeStyles[size];
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

  // Fallback to initials
  return (
    <View
      className={`${container} rounded-full items-center justify-center ${borderStyle}`}
      style={{ backgroundColor: colors.primaryLight }}
    >
      <Text
        className={`${text} font-montserrat-semibold`}
        style={{ color: colors.primary }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}
