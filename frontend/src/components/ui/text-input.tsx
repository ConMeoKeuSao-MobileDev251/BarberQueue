/**
 * Text Input Component
 * With validation states and icons
 */
import { TextInput as RNTextInput, View, Text, Pressable } from "react-native";
import { ReactNode, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

type InputState = "default" | "focus" | "valid" | "error";

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  isValid?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function TextInput({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  isValid,
  secureTextEntry: initialSecure = false,
  keyboardType = "default",
  autoCapitalize = "none",
  leftIcon,
  rightIcon,
  editable = true,
  multiline = false,
  numberOfLines = 1,
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(initialSecure);

  // Determine input state
  const getState = (): InputState => {
    if (error) return "error";
    if (isValid) return "valid";
    if (isFocused) return "focus";
    return "default";
  };

  const state = getState();

  // Border color based on state
  const getBorderColor = () => {
    switch (state) {
      case "error":
        return "border-coral";
      case "valid":
        return "border-success";
      case "focus":
        return "border-primary";
      default:
        return "border-border-medium";
    }
  };

  return (
    <View className="w-full">
      {label && (
        <Text className="text-text-primary text-sm font-montserrat-medium mb-2">
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center h-14 px-4 border rounded-lg bg-white ${getBorderColor()}`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 text-text-primary text-md font-montserrat-regular"
          style={{ fontFamily: "Montserrat-Regular" }}
        />

        {/* Show/hide password toggle */}
        {initialSecure && (
          <Pressable onPress={() => setIsSecure(!isSecure)} className="ml-2">
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.textTertiary}
            />
          </Pressable>
        )}

        {/* Valid checkmark */}
        {isValid && !initialSecure && (
          <Ionicons name="checkmark-circle" size={22} color={colors.success} />
        )}

        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>

      {error && (
        <Text className="text-coral text-sm font-montserrat-regular mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
