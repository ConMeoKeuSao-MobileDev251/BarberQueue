/**
 * Form Date Input Component
 * Date picker input integrated with react-hook-form
 */
import { View, Text, Pressable, Platform } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "@/src/constants/theme";

interface FormDateInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function FormDateInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "DD/MM/YYYY",
  maximumDate,
  minimumDate,
}: FormDateInputProps<T>) {
  const [showPicker, setShowPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Format date to Vietnamese format (DD/MM/YYYY)
  const formatDate = (date: Date | string | null): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const getContainerStyle = () => {
          if (error) return "bg-white border border-coral";
          if (isFocused) return "bg-white border border-primary";
          return "bg-white border border-gray-300";
        };

        const currentDate = value ? new Date(value) : new Date();

        return (
          <View className="w-full">
            {label && (
              <Text className="text-text-primary text-sm font-montserrat-medium mb-2">
                {label}
              </Text>
            )}

            <Pressable
              onPress={() => {
                setShowPicker(true);
                setIsFocused(true);
              }}
              className={`flex-row items-center h-14 px-4 rounded-lg ${getContainerStyle()}`}
            >
              <Text
                className={`flex-1 text-md font-montserrat-regular ${
                  value ? "text-text-primary" : "text-text-tertiary"
                }`}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {value ? formatDate(value) : placeholder}
              </Text>

              <Ionicons
                name="calendar-outline"
                size={22}
                color={colors.primary}
              />
            </Pressable>

            {error && (
              <Text className="text-coral text-sm font-montserrat-regular mt-1">
                {error.message}
              </Text>
            )}

            {showPicker && (
              <DateTimePicker
                value={currentDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={(event, selectedDate) => {
                  setShowPicker(Platform.OS === "ios");
                  setIsFocused(false);
                  if (event.type === "set" && selectedDate) {
                    onChange(selectedDate.toISOString());
                  }
                }}
              />
            )}
          </View>
        );
      }}
    />
  );
}
