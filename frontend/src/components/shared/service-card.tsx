/**
 * Service Card Component
 * Displays a service with image, name, price, and duration
 */
import { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface ServiceCardProps {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  image?: string | null;
  description?: string;
  onPress?: () => void;
  onAddToCart?: () => void;
  inCart?: boolean;
  variant?: "vertical" | "horizontal";
}

function ServiceCardComponent({
  name,
  price,
  duration,
  image,
  description,
  onPress,
  onAddToCart,
  inCart = false,
  variant = "vertical",
}: ServiceCardProps) {
  const formatPrice = useCallback((amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  }, []);

  const formatDuration = useCallback((mins: number) => {
    if (mins < 60) return `${mins} phút`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hours}h${remainingMins}p` : `${hours} giờ`;
  }, []);

  if (variant === "horizontal") {
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
        <View className="w-24 h-24">
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View className="flex-1 bg-primary-light items-center justify-center">
              <Ionicons name="cut" size={32} color={colors.primary} />
            </View>
          )}
        </View>

        {/* Content */}
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-md font-montserrat-semibold text-text-primary" numberOfLines={1}>
              {name}
            </Text>
            {description && (
              <Text className="text-xs font-montserrat-regular text-text-secondary mt-1" numberOfLines={2}>
                {description}
              </Text>
            )}
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-md font-montserrat-bold text-primary">
              {formatPrice(price)}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
              <Text className="text-xs font-montserrat-regular text-text-tertiary ml-1">
                {formatDuration(duration)}
              </Text>
            </View>
          </View>
        </View>

        {/* Add to cart button */}
        {onAddToCart && (
          <Pressable
            onPress={onAddToCart}
            className="absolute right-2 bottom-2 w-8 h-8 rounded-full items-center justify-center"
            style={{
              backgroundColor: inCart ? colors.success : colors.primary,
            }}
          >
            <Ionicons
              name={inCart ? "checkmark" : "add"}
              size={20}
              color="white"
            />
          </Pressable>
        )}
      </Pressable>
    );
  }

  // Vertical variant
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl overflow-hidden shadow-sm w-40"
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Image */}
      <View className="h-28">
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View className="flex-1 bg-primary-light items-center justify-center">
            <Ionicons name="cut" size={36} color={colors.primary} />
          </View>
        )}
      </View>

      {/* Content */}
      <View className="p-3">
        <Text className="text-sm font-montserrat-semibold text-text-primary" numberOfLines={1}>
          {name}
        </Text>

        <View className="flex-row items-center mt-1">
          <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
          <Text className="text-xs font-montserrat-regular text-text-tertiary ml-1">
            {formatDuration(duration)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm font-montserrat-bold text-primary">
            {formatPrice(price)}
          </Text>

          {onAddToCart && (
            <Pressable
              onPress={onAddToCart}
              className="w-7 h-7 rounded-full items-center justify-center"
              style={{
                backgroundColor: inCart ? colors.success : colors.primary,
              }}
            >
              <Ionicons
                name={inCart ? "checkmark" : "add"}
                size={18}
                color="white"
              />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// Memoized export for performance optimization
export const ServiceCard = memo(ServiceCardComponent);
