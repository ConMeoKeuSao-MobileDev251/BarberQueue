/**
 * BarberQueue Logo Component
 * Displays the brand logo with icon and text for better visibility
 */
import { View, Text } from "react-native";
import { Image } from "expo-image";

// Logo icon without text - higher resolution for clarity
const logoIcon = require("@/assets/barberqueue_logo_notext.png");

interface BarberQueueLogoProps {
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: { iconSize: 24, fontSize: "text-sm", gap: "gap-1" },
  md: { iconSize: 32, fontSize: "text-base", gap: "gap-1.5" },
  lg: { iconSize: 40, fontSize: "text-lg", gap: "gap-2" },
};

export function BarberQueueLogo({ size = "md" }: BarberQueueLogoProps) {
  const config = sizeConfig[size];

  return (
    <View className={`flex-row items-center ${config.gap}`}>
      <Image
        source={logoIcon}
        style={{ width: config.iconSize, height: config.iconSize }}
        contentFit="contain"
      />
      <Text className={`${config.fontSize} font-montserrat-bold text-text-primary`}>
        BarberQueue
      </Text>
    </View>
  );
}
