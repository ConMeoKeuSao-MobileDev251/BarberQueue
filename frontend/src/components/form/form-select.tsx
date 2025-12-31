/**
 * Form Select Component
 * Dropdown select integrated with react-hook-form
 */
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/constants/theme";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  rules?: object;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  options,
  label,
  placeholder = "Chọn...",
  rules,
}: FormSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === value);

        const getBorderColor = () => {
          if (error) return "border-coral";
          return "border-border-medium";
        };

        return (
          <View className="w-full">
            {label && (
              <Text className="text-text-primary text-sm font-montserrat-medium mb-2">
                {label}
              </Text>
            )}

            {/* Select trigger */}
            <Pressable
              onPress={() => setIsOpen(true)}
              className={`flex-row items-center justify-between h-14 px-4 border rounded-lg bg-white ${getBorderColor()}`}
            >
              <Text
                className={`text-md font-montserrat-regular ${
                  selectedOption ? "text-text-primary" : "text-text-tertiary"
                }`}
              >
                {selectedOption?.label || placeholder}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </Pressable>

            {error && (
              <Text className="text-coral text-sm font-montserrat-regular mt-1">
                {error.message}
              </Text>
            )}

            {/* Options modal */}
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
                      {label || "Chọn"}
                    </Text>
                    <Pressable onPress={() => setIsOpen(false)}>
                      <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </Pressable>
                  </View>

                  {/* Options */}
                  <ScrollView className="max-h-80">
                    {options.map((option) => {
                      const isSelected = option.value === value;

                      return (
                        <Pressable
                          key={option.value}
                          onPress={() => {
                            onChange(option.value);
                            setIsOpen(false);
                          }}
                          className={`flex-row items-center justify-between px-4 py-4 border-b border-border-light ${
                            isSelected ? "bg-primary-light" : ""
                          }`}
                        >
                          <Text
                            className={`text-md font-montserrat-medium ${
                              isSelected ? "text-primary" : "text-text-primary"
                            }`}
                          >
                            {option.label}
                          </Text>
                          {isSelected && (
                            <Ionicons name="checkmark" size={22} color={colors.primary} />
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
