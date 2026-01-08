/**
 * Form Input Component
 * Text input integrated with react-hook-form using useController hook
 */
import { TextInput as RNTextInput, View, Text, Pressable } from "react-native";
import { Control, useController, FieldValues, Path } from "react-hook-form";
import { ReactNode, useState, useCallback } from "react";
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
}: FormInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(initialSecure);

  const {
    field: { onChange, onBlur, value },
    fieldState: { error, invalid },
  } = useController({ control, name });

  const handleChangeText = useCallback(
    (text: string) => {
      onChange(text);
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur();
  }, [onBlur]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Determine container style based on state
  const getContainerStyle = () => {
    if (error) return "bg-white border border-coral";
    if (isFocused) return "bg-white border border-primary";
    return "bg-white border border-gray-300";
  };

  return (
    <View className="w-full">
      {label && (
        <Text className="text-text-primary text-sm font-montserrat-medium mb-2">
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center h-14 px-4 rounded-lg ${getContainerStyle()}`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <RNTextInput
          value={value ?? ""}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={{
            flex: 1,
            color: colors.textPrimary,
            fontSize: 16,
            fontFamily: "Montserrat-Regular",
          }}
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

        {/* Valid checkmark - only show when valid and has value */}
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
}
