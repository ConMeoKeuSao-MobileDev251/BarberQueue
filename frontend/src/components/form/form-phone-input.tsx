/**
 * Form Phone Input Component
 * Phone number input (10 digits) using useController hook
 */
import { TextInput as RNTextInput, View, Text } from "react-native";
import { Control, useController, FieldValues, Path } from "react-hook-form";
import { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface FormPhoneInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function FormPhoneInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "0123 456 789",
}: FormPhoneInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);

  const {
    field: { onChange, onBlur, value },
    fieldState: { error, invalid },
  } = useController({ control, name });

  // Format phone number with spacing (0XXX XXX XXX)
  const formatPhoneNumber = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
  };

  const handleChangeText = useCallback(
    (text: string) => {
      const cleaned = text.replace(/\s/g, "");
      if (cleaned.length <= 10) {
        onChange(cleaned);
      }
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
        {/* Phone icon */}
        <Ionicons
          name="call-outline"
          size={20}
          color={colors.textTertiary}
          style={{ marginRight: 12 }}
        />

        {/* Phone input */}
        <RNTextInput
          value={formatPhoneNumber(value || "")}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType="phone-pad"
          maxLength={12}
          style={{
            flex: 1,
            color: colors.textPrimary,
            fontSize: 16,
            fontFamily: "Montserrat-Regular",
          }}
        />

        {/* Valid checkmark */}
        {!invalid && value && value.length === 10 && (
          <Ionicons name="checkmark-circle" size={22} color={colors.success} />
        )}
      </View>

      {error && (
        <Text className="text-coral text-sm font-montserrat-regular mt-1">
          {error.message}
        </Text>
      )}
    </View>
  );
}
