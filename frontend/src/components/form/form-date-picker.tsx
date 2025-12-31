/**
 * Form Date Picker Component
 * Date selection integrated with react-hook-form
 */
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/constants/theme";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  rules?: object;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Chọn ngày",
  minDate = new Date(),
  maxDate,
  rules,
}: FormDatePickerProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // Generate next 30 days
  const generateDates = () => {
    const dates: Date[] = [];
    const startDate = new Date(minDate);
    const endDate = maxDate || new Date(minDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    while (startDate <= endDate) {
      dates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
  };

  const formatDate = (date: Date) => {
    const weekdays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    return {
      weekday: weekdays[date.getDay()],
      day: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear(),
      full: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedDate = value ? new Date(value) : null;
        const dates = generateDates();

        const getBorderColor = () => {
          if (error) return "border-coral";
          return "border-border-medium";
        };

        const getDisplayText = () => {
          if (!selectedDate) return placeholder;
          const formatted = formatDate(selectedDate);
          if (isToday(selectedDate)) return `Hôm nay, ${formatted.day}/${formatted.month.split(" ")[1]}`;
          if (isTomorrow(selectedDate)) return `Ngày mai, ${formatted.day}/${formatted.month.split(" ")[1]}`;
          return `${formatted.weekday}, ${formatted.full}`;
        };

        return (
          <View className="w-full">
            {label && (
              <Text className="text-text-primary text-sm font-montserrat-medium mb-2">
                {label}
              </Text>
            )}

            {/* Date trigger */}
            <Pressable
              onPress={() => setIsOpen(true)}
              className={`flex-row items-center justify-between h-14 px-4 border rounded-lg bg-white ${getBorderColor()}`}
            >
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                <Text
                  className={`ml-3 text-md font-montserrat-regular ${
                    selectedDate ? "text-text-primary" : "text-text-tertiary"
                  }`}
                >
                  {getDisplayText()}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </Pressable>

            {error && (
              <Text className="text-coral text-sm font-montserrat-regular mt-1">
                {error.message}
              </Text>
            )}

            {/* Date picker modal */}
            <Modal visible={isOpen} transparent animationType="slide" onRequestClose={() => setIsOpen(false)}>
              <Pressable className="flex-1 bg-black/50" onPress={() => setIsOpen(false)}>
                <View
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
                  style={{ paddingBottom: insets.bottom }}
                >
                  {/* Handle */}
                  <View className="items-center pt-3 pb-2">
                    <View className="w-10 h-1 rounded-full bg-gray-300" />
                  </View>

                  {/* Header */}
                  <View className="flex-row items-center justify-between px-4 py-3 border-b border-border-light">
                    <Text className="text-lg font-montserrat-semibold text-text-primary">
                      Chọn ngày
                    </Text>
                    <Pressable onPress={() => setIsOpen(false)}>
                      <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </Pressable>
                  </View>

                  {/* Date list */}
                  <ScrollView className="max-h-96">
                    {dates.map((date, index) => {
                      const formatted = formatDate(date);
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      const today = isToday(date);
                      const tomorrow = isTomorrow(date);

                      return (
                        <Pressable
                          key={index}
                          onPress={() => {
                            onChange(date.toISOString());
                            setIsOpen(false);
                          }}
                          className={`flex-row items-center justify-between px-4 py-4 border-b border-border-light ${
                            isSelected ? "bg-primary-light" : ""
                          }`}
                        >
                          <View>
                            <Text
                              className={`text-md font-montserrat-semibold ${
                                isSelected ? "text-primary" : "text-text-primary"
                              }`}
                            >
                              {today ? "Hôm nay" : tomorrow ? "Ngày mai" : formatted.weekday}
                            </Text>
                            <Text className="text-sm font-montserrat-regular text-text-secondary mt-1">
                              {formatted.day} {formatted.month}, {formatted.year}
                            </Text>
                          </View>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                          )}
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              </Pressable>
            </Modal>
          </View>
        );
      }}
    />
  );
}
