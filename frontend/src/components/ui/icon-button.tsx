/**
 * Icon Button Component
 * Circular button for icons only
 */
import { Pressable, View } from "react-native";
import { ReactNode } from "react";

type IconButtonVariant = "primary" | "secondary" | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps {
  icon: ReactNode;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
}

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function IconButton({
  icon,
  onPress,
  variant = "ghost",
  size = "md",
  disabled = false,
}: IconButtonProps) {
  const getContainerStyle = () => {
    const base = `${sizeStyles[size]} items-center justify-center rounded-full`;

    if (disabled) return `${base} bg-gray-200`;

    switch (variant) {
      case "primary":
        return `${base} bg-primary`;
      case "secondary":
        return `${base} bg-white border border-border-light`;
      case "ghost":
        return `${base} bg-transparent`;
      default:
        return `${base} bg-transparent`;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={getContainerStyle()}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      <View className="items-center justify-center">{icon}</View>
    </Pressable>
  );
}
