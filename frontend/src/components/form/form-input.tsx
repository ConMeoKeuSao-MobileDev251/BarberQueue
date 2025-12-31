/**
 * Form Input Component
 * Text input integrated with react-hook-form
 */
import { TextInput as RNTextInput, View, Text, Pressable } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ReactNode, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  rules?: object;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry: initialSecure = false,
  keyboardType = "default",
  autoCapitalize = "none",
  leftIcon,
  rightIcon,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  rules,
}: FormInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(initialSecure);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error, invalid } }) => {
        // Determine border color based on state
        const getBorderColor = () => {
          if (error) return "border-coral";
          if (isFocused) return "border-primary";
          return "border-border-medium";
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
                onChangeText={onChange}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur();
                }}
                onFocus={() => setIsFocused(true)}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={isSecure}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                editable={editable}
                multiline={multiline}
                numberOfLines={numberOfLines}
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
              {!invalid && value && !initialSecure && (
                <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              )}

              {rightIcon && <View className="ml-2">{rightIcon}</View>}
            </View>

            {error && (
              <Text className="text-coral text-sm font-montserrat-regular mt-1">
                {error.message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}
