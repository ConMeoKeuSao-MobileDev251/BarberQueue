/**
 * Quantity Stepper Component
 * Increment/decrement control for quantities
 */
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: QuantityStepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  const handleDecrement = () => {
    if (canDecrement) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (canIncrement) {
      onChange(value + 1);
    }
  };

  const buttonSize = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconSize = size === "sm" ? 16 : 20;
  const textSize = size === "sm" ? "text-sm" : "text-md";
  const minWidth = size === "sm" ? "min-w-[28px]" : "min-w-[36px]";

  return (
    <View className="flex-row items-center">
      {/* Decrement button */}
      <Pressable
        onPress={handleDecrement}
        disabled={!canDecrement}
        className={`${buttonSize} rounded-full items-center justify-center ${
          canDecrement ? "bg-primary-light" : "bg-gray-100"
        }`}
        style={({ pressed }) => ({
          opacity: !canDecrement ? 0.5 : pressed ? 0.8 : 1,
        })}
      >
        <Ionicons
          name="remove"
          size={iconSize}
          color={canDecrement ? colors.primary : colors.textTertiary}
        />
      </Pressable>

      {/* Value display */}
      <View className={`${minWidth} items-center mx-2`}>
        <Text className={`${textSize} font-montserrat-semibold text-text-primary`}>
          {value}
        </Text>
      </View>

      {/* Increment button */}
      <Pressable
        onPress={handleIncrement}
        disabled={!canIncrement}
        className={`${buttonSize} rounded-full items-center justify-center ${
          canIncrement ? "bg-primary" : "bg-gray-100"
        }`}
        style={({ pressed }) => ({
          opacity: !canIncrement ? 0.5 : pressed ? 0.8 : 1,
        })}
      >
        <Ionicons
          name="add"
          size={iconSize}
          color={canIncrement ? "white" : colors.textTertiary}
        />
      </Pressable>
    </View>
  );
}

/**
 * Cart Item with Quantity Stepper
 */
interface CartItemStepperProps {
  name: string;
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemStepper({
  name,
  price,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemStepperProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  return (
    <View className="flex-row items-center py-4 border-b border-border-light">
      <View className="flex-1">
        <Text className="text-md font-montserrat-medium text-text-primary" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-sm font-montserrat-semibold text-primary mt-1">
          {formatPrice(price)}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={onQuantityChange}
          min={0}
          size="sm"
        />

        <Pressable onPress={onRemove} className="p-2">
          <Ionicons name="trash-outline" size={20} color={colors.coral} />
        </Pressable>
      </View>
    </View>
  );
}
