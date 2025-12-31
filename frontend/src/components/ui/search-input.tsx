/**
 * Search Input Component
 * Rounded search input with icon
 */
import { TextInput, View, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Tìm kiếm...",
  onSubmit,
  onClear,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View
      className={`flex-row items-center h-12 px-4 rounded-full bg-background-secondary border ${
        isFocused ? "border-primary" : "border-border-light"
      }`}
    >
      <Ionicons name="search" size={20} color={colors.primary} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        className="flex-1 ml-3 text-text-primary text-md font-montserrat-regular"
        style={{ fontFamily: "Montserrat-Regular" }}
      />

      {value.length > 0 && (
        <Pressable onPress={handleClear} className="ml-2">
          <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}
