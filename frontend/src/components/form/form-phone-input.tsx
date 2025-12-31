/**
 * Form Phone Input Component
 * Phone number input with country code prefix
 */
import { TextInput as RNTextInput, View, Text, Pressable } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface FormPhoneInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  countryCode?: string;
  rules?: object;
}

export function FormPhoneInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Nhập số điện thoại",
  countryCode = "+84",
  rules,
}: FormPhoneInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);

  // Format phone number with spacing
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format: XXX XXX XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  };

  // Clean phone number (remove spaces)
  const cleanPhoneNumber = (value: string) => {
    return value.replace(/\s/g, "");
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error, invalid } }) => {
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
              className={`flex-row items-center h-14 border rounded-lg bg-white ${getBorderColor()}`}
            >
              {/* Country code prefix */}
              <Pressable className="flex-row items-center px-4 h-full border-r border-border-light">
                <Text className="text-md font-montserrat-medium text-text-primary">
                  {countryCode}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={colors.textSecondary}
                  style={{ marginLeft: 4 }}
                />
              </Pressable>

              {/* Phone input */}
              <RNTextInput
                value={formatPhoneNumber(value || "")}
                onChangeText={(text) => {
                  const cleaned = cleanPhoneNumber(text);
                  // Only allow up to 10 digits
                  if (cleaned.length <= 10) {
                    onChange(cleaned);
                  }
                }}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur();
                }}
                onFocus={() => setIsFocused(true)}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
                className="flex-1 px-4 text-text-primary text-md font-montserrat-regular"
                style={{ fontFamily: "Montserrat-Regular" }}
                maxLength={12} // 10 digits + 2 spaces
              />

              {/* Valid checkmark */}
              {!invalid && value && value.length >= 9 && (
                <View className="pr-4">
                  <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                </View>
              )}
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
