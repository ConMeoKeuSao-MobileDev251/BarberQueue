/**
 * Filter Chips Component
 * Horizontal scrollable filter options
 */
import { ScrollView, Text, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface FilterOption {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected?: string | string[];
  onChange: (id: string) => void;
  multiple?: boolean;
}

export function FilterChips({
  options,
  selected,
  onChange,
  multiple = false,
}: FilterChipsProps) {
  const isSelected = (id: string) => {
    if (multiple && Array.isArray(selected)) {
      return selected.includes(id);
    }
    return selected === id;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {options.map((option) => {
        const active = isSelected(option.id);

        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            className={`flex-row items-center px-4 py-2 rounded-full ${
              active
                ? "bg-primary"
                : "bg-white border border-border-medium"
            }`}
          >
            {option.icon && (
              <Ionicons
                name={option.icon}
                size={16}
                color={active ? "white" : colors.textSecondary}
                style={{ marginRight: 6 }}
              />
            )}
            <Text
              className={`text-sm font-montserrat-medium ${
                active ? "text-white" : "text-text-primary"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/**
 * Category Tabs - Tab-style filter
 */
interface CategoryTabsProps {
  categories: { id: string; label: string }[];
  selected: string;
  onChange: (id: string) => void;
}

export function CategoryTabs({
  categories,
  selected,
  onChange,
}: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {categories.map((category) => {
        const active = category.id === selected;

        return (
          <Pressable
            key={category.id}
            onPress={() => onChange(category.id)}
            className={`px-5 py-3 mr-2 rounded-lg ${
              active ? "bg-primary" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-montserrat-semibold ${
                active ? "text-white" : "text-text-secondary"
              }`}
            >
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/**
 * Sort Options
 */
interface SortOption {
  id: string;
  label: string;
}

interface SortOptionsProps {
  options: SortOption[];
  selected: string;
  onChange: (id: string) => void;
}

export function SortOptions({ options, selected, onChange }: SortOptionsProps) {
  return (
    <View className="gap-2">
      {options.map((option) => {
        const active = option.id === selected;

        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            className={`flex-row items-center px-4 py-3 rounded-lg ${
              active ? "bg-primary-light" : "bg-white"
            }`}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                active ? "border-primary bg-primary" : "border-border-medium"
              }`}
            >
              {active && (
                <View className="w-2 h-2 rounded-full bg-white" />
              )}
            </View>
            <Text
              className={`text-md font-montserrat-medium ${
                active ? "text-primary" : "text-text-primary"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
