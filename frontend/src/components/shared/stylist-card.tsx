/**
 * Stylist Card Component
 * Displays a stylist/barber with avatar, name, and rating
 */
import { View, Text, Pressable } from "react-native";
import { Avatar } from "@/src/components/ui/avatar";
import { Rating } from "@/src/components/ui/rating";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface StylistCardProps {
  id: string;
  name: string;
  avatar?: string | null;
  specialty?: string;
  rating?: number;
  reviewCount?: number;
  isAvailable?: boolean;
  onPress?: () => void;
  selected?: boolean;
  variant?: "horizontal" | "vertical";
}

export function StylistCard({
  name,
  avatar,
  specialty,
  rating = 0,
  reviewCount = 0,
  isAvailable = true,
  onPress,
  selected = false,
  variant = "horizontal",
}: StylistCardProps) {
  if (variant === "vertical") {
    return (
      <Pressable
        onPress={onPress}
        disabled={!isAvailable}
        className={`items-center w-24 p-3 rounded-xl ${
          selected ? "bg-primary-light border-2 border-primary" : "bg-white"
        } ${!isAvailable ? "opacity-50" : ""}`}
        style={({ pressed }) => ({
          opacity: !isAvailable ? 0.5 : pressed ? 0.9 : 1,
        })}
      >
        <View className="relative">
          <Avatar source={avatar} name={name} size="lg" />
          {!isAvailable && (
            <View className="absolute inset-0 bg-black/40 rounded-full items-center justify-center">
              <Text className="text-xs font-montserrat-medium text-white">Bận</Text>
            </View>
          )}
        </View>

        <Text
          className="text-sm font-montserrat-semibold text-text-primary text-center mt-2"
          numberOfLines={1}
        >
          {name}
        </Text>

        {specialty && (
          <Text
            className="text-xs font-montserrat-regular text-text-tertiary text-center mt-1"
            numberOfLines={1}
          >
            {specialty}
          </Text>
        )}

        {rating > 0 && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="star" size={12} color={colors.rating} />
            <Text className="text-xs font-montserrat-medium text-text-secondary ml-1">
              {rating.toFixed(1)}
            </Text>
          </View>
        )}
      </Pressable>
    );
  }

  // Horizontal variant
  return (
    <Pressable
      onPress={onPress}
      disabled={!isAvailable}
      className={`flex-row items-center p-4 rounded-xl ${
        selected ? "bg-primary-light border-2 border-primary" : "bg-white"
      } ${!isAvailable ? "opacity-50" : ""}`}
      style={({ pressed }) => ({
        opacity: !isAvailable ? 0.5 : pressed ? 0.9 : 1,
      })}
    >
      <View className="relative">
        <Avatar source={avatar} name={name} size="lg" />
        {selected && (
          <View className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-primary items-center justify-center">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-md font-montserrat-semibold text-text-primary">
          {name}
        </Text>

        {specialty && (
          <Text className="text-sm font-montserrat-regular text-text-tertiary mt-1">
            {specialty}
          </Text>
        )}

        <View className="flex-row items-center mt-2">
          <Rating score={rating} count={reviewCount} size="sm" />
        </View>
      </View>

      {/* Availability indicator */}
      <View className="items-end">
        <View
          className={`w-3 h-3 rounded-full ${
            isAvailable ? "bg-success" : "bg-gray-400"
          }`}
        />
        <Text
          className={`text-xs font-montserrat-medium mt-1 ${
            isAvailable ? "text-success" : "text-text-tertiary"
          }`}
        >
          {isAvailable ? "Sẵn sàng" : "Bận"}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Any Stylist Option - Special card for "any available stylist"
 */
interface AnyStylistCardProps {
  onPress?: () => void;
  selected?: boolean;
}

export function AnyStylistCard({ onPress, selected = false }: AnyStylistCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center p-4 rounded-xl ${
        selected ? "bg-primary-light border-2 border-primary" : "bg-white"
      }`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center">
        <Ionicons name="people" size={28} color={colors.textSecondary} />
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-md font-montserrat-semibold text-text-primary">
          Thợ bất kỳ
        </Text>
        <Text className="text-sm font-montserrat-regular text-text-tertiary mt-1">
          Hệ thống sẽ chọn thợ có sẵn
        </Text>
      </View>

      {selected && (
        <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
          <Ionicons name="checkmark" size={16} color="white" />
        </View>
      )}
    </Pressable>
  );
}
