/**
 * Button Component
 * Primary, Secondary, Destructive, and Text variants
 */
import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { gradients } from "@/src/constants/theme";

type ButtonVariant = "primary" | "secondary" | "destructive" | "text" | "gradient";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const sizeStyles = {
  sm: "px-4 py-2",
  md: "px-6 py-3",
  lg: "px-8 py-4",
};

const textSizes = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Base container styles
  const baseContainer = `flex-row items-center justify-center rounded-full ${sizeStyles[size]} ${fullWidth ? "w-full" : ""}`;

  // Variant-specific styles
  const getContainerStyle = () => {
    if (isDisabled) return `${baseContainer} bg-gray-300`;

    switch (variant) {
      case "primary":
        return `${baseContainer} bg-primary`;
      case "secondary":
        return `${baseContainer} border border-primary bg-transparent`;
      case "destructive":
        return `${baseContainer} bg-coral`;
      case "text":
        return `${baseContainer} bg-transparent`;
      case "gradient":
        return `${baseContainer}`;
      default:
        return `${baseContainer} bg-primary`;
    }
  };

  // Text styles
  const getTextStyle = () => {
    const baseText = `font-montserrat-medium ${textSizes[size]} text-center`;

    if (isDisabled) return `${baseText} text-gray-500`;

    switch (variant) {
      case "primary":
      case "destructive":
      case "gradient":
        return `${baseText} text-white`;
      case "secondary":
      case "text":
        return `${baseText} text-primary`;
      default:
        return `${baseText} text-white`;
    }
  };

  const content = (
    <View className="flex-row items-center justify-center gap-2">
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "secondary" || variant === "text" ? "#FF6B35" : "#FFFFFF"}
        />
      ) : (
        <>
          {leftIcon}
          <Text className={getTextStyle()}>{children}</Text>
          {rightIcon}
        </>
      )}
    </View>
  );

  // Common accessibility props
  const a11yProps = {
    accessibilityRole: "button" as const,
    accessibilityLabel: accessibilityLabel || (typeof children === "string" ? children : undefined),
    accessibilityHint,
    accessibilityState: {
      disabled: isDisabled,
      busy: loading,
    },
  };

  // Gradient button wrapper
  if (variant === "gradient" && !isDisabled) {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={fullWidth ? "w-full" : ""}
        style={({ pressed }) => ({
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
        {...a11yProps}
      >
        <LinearGradient
          colors={[...gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className={`${baseContainer} overflow-hidden`}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={getContainerStyle()}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
      {...a11yProps}
    >
      {content}
    </Pressable>
  );
}
