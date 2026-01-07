/**
 * Shop Card Component
 * Displays a barbershop with image, name, rating, and location
 */
import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "@/src/components/ui/rating";
import { colors } from "@/src/constants/theme";

// Default shop thumbnail image
const shopThumbnail = require("@/assets/images/shop-thumbnail.png");

interface ShopCardProps {
  id: string;
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  image?: string | null;
  distance?: string;
  isOpen?: boolean;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  variant?: "large" | "compact";
}

function ShopCardComponent({
  name,
  address,
  rating = 0,
  reviewCount = 0,
  image,
  distance,
  isOpen = true,
  onPress,
  onFavorite,
  isFavorite = false,
  variant = "large",
}: ShopCardProps) {
  if (variant === "compact") {
    return (
      <Pressable
        onPress={onPress}
        className="flex-row bg-white rounded-xl overflow-hidden shadow-sm"
        style={({ pressed }) => ({
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        {/* Image */}
        <View className="w-20 h-20">
          <Image
            source={image ? { uri: image } : shopThumbnail}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Content */}
        <View className="flex-1 p-3 justify-center">
          <Text className="text-sm font-montserrat-semibold text-text-primary" numberOfLines={1}>
            {name}
          </Text>

          <View className="flex-row items-center mt-1">
            <Rating score={rating} count={reviewCount} size="sm" />
          </View>

          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
            <Text className="text-xs font-montserrat-regular text-text-tertiary ml-1 flex-1" numberOfLines={1}>
              {address}
            </Text>
          </View>
        </View>

        {/* Distance */}
        {distance && (
          <View className="p-3 justify-center">
            <Text className="text-xs font-montserrat-medium text-primary">{distance}</Text>
          </View>
        )}
      </Pressable>
    );
  }

  // Large variant
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl overflow-hidden shadow-sm"
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Image */}
      <View className="h-40 relative">
        <Image
          source={image ? { uri: image } : shopThumbnail}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={200}
        />

        {/* Status badge */}
        <View
          className={`absolute top-3 left-3 px-2 py-1 rounded-full ${
            isOpen ? "bg-success" : "bg-gray-500"
          }`}
        >
          <Text className="text-xs font-montserrat-medium text-white">
            {isOpen ? "Đang mở" : "Đã đóng"}
          </Text>
        </View>

        {/* Favorite button */}
        {onFavorite && (
          <Pressable
            onPress={onFavorite}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 items-center justify-center"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? colors.coral : colors.textSecondary}
            />
          </Pressable>
        )}

        {/* Distance badge */}
        {distance && (
          <View className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/60">
            <Text className="text-xs font-montserrat-medium text-white">{distance}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="p-4">
        <Text className="text-md font-montserrat-semibold text-text-primary" numberOfLines={1}>
          {name}
        </Text>

        <View className="flex-row items-center mt-2">
          <Rating score={rating} count={reviewCount} size="sm" />
        </View>

        <View className="flex-row items-center mt-2">
          <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
          <Text className="text-sm font-montserrat-regular text-text-tertiary ml-1 flex-1" numberOfLines={1}>
            {address}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// Memoized export for performance optimization
export const ShopCard = memo(ShopCardComponent);
