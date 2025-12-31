/**
 * Rating Component
 * Star rating display with score and count
 */
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface RatingProps {
  score: number;
  count?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 14, text: "text-xs" },
  md: { icon: 16, text: "text-sm" },
  lg: { icon: 20, text: "text-md" },
};

export function Rating({
  score,
  count,
  showCount = true,
  size = "md",
}: RatingProps) {
  const { icon, text } = sizes[size];

  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name="star" size={icon} color={colors.rating} />
      <Text className={`${text} font-montserrat-medium text-text-primary`}>
        {score.toFixed(1)}
      </Text>
      {showCount && count !== undefined && (
        <Text className={`${text} font-montserrat-regular text-text-secondary`}>
          ({count})
        </Text>
      )}
    </View>
  );
}
