/**
 * Promo Codes Screen
 * Apply promotional codes to booking
 */
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useCartStore } from "@/src/stores";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { TextInput } from "@/src/components/ui/text-input";
import { Button } from "@/src/components/ui/button";
import { colors } from "@/src/constants/theme";

// Single hardcoded promo: 20% off
const PROMO = {
  code: "WELCOME20",
  title: "Giảm 20%",
  description: "Áp dụng cho tất cả dịch vụ",
  discount: 20, // percentage
};

export default function PromosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { promoCode, setPromo } = useCartStore();

  const [inputCode, setInputCode] = useState(promoCode || "");
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(!!promoCode);

  const handleApplyCode = () => {
    setError(null);

    if (inputCode.toUpperCase() === PROMO.code) {
      setPromo(PROMO.code, PROMO.discount);
      setIsApplied(true);
    } else {
      setError("Mã giảm giá không hợp lệ");
      setIsApplied(false);
    }
  };

  const handleSelectPromo = () => {
    setInputCode(PROMO.code);
    setPromo(PROMO.code, PROMO.discount);
    setIsApplied(true);
    setError(null);
  };

  const handleRemovePromo = () => {
    setInputCode("");
    setPromo(null, 0);
    setIsApplied(false);
    setError(null);
  };

  const handleConfirm = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title="Khuyến mãi" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Code Input */}
        <View className="bg-white p-4 mt-4">
          <Text className="text-text-primary text-sm font-montserrat-medium mb-2">
            Mã giảm giá
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextInput
                value={inputCode}
                onChangeText={(text) => {
                  setInputCode(text.toUpperCase());
                  setError(null);
                  if (text.toUpperCase() !== PROMO.code) {
                    setIsApplied(false);
                  }
                }}
                placeholder="Nhập mã giảm giá"
                error={error || undefined}
                isValid={isApplied}
              />
            </View>
            <Button
              variant="text"
              onPress={handleApplyCode}
              disabled={!inputCode.trim()}
            >
              ÁP DỤNG
            </Button>
          </View>
        </View>

        {/* Applied Promo */}
        {isApplied && (
          <View className="bg-success-light mx-4 mt-4 p-4 rounded-xl flex-row items-center">
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <View className="flex-1 ml-3">
              <Text className="text-success text-md font-montserrat-medium">
                Đã áp dụng mã {PROMO.code}
              </Text>
              <Text className="text-success/80 text-sm font-montserrat-regular">
                Giảm {PROMO.discount}% tổng hóa đơn
              </Text>
            </View>
            <Pressable onPress={handleRemovePromo}>
              <Ionicons name="close-circle" size={24} color={colors.success} />
            </Pressable>
          </View>
        )}

        {/* Available Promo */}
        <View className="p-4 mt-4">
          <Text className="text-text-primary text-md font-montserrat-semibold mb-3">
            Khuyến mãi có sẵn
          </Text>

          <View
            className={`bg-white rounded-xl p-4 border ${isApplied ? "border-success" : "border-border-light"}`}
          >
            <View className="flex-row items-start">
              <View className="w-12 h-12 rounded-lg bg-primary-light items-center justify-center">
                <Ionicons name="pricetag" size={24} color={colors.primary} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-text-primary text-md font-montserrat-semibold">
                  {PROMO.title}
                </Text>
                <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                  {PROMO.description}
                </Text>
                <View className="flex-row items-center mt-2">
                  <View className="bg-gray-100 px-2 py-1 rounded">
                    <Text className="text-text-primary text-xs font-montserrat-medium">
                      {PROMO.code}
                    </Text>
                  </View>
                  {isApplied && (
                    <View className="flex-row items-center ml-2">
                      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                      <Text className="text-success text-xs font-montserrat-medium ml-1">
                        Đã áp dụng
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {!isApplied && (
              <Pressable onPress={handleSelectPromo} className="mt-3 py-2">
                <Text className="text-primary text-sm font-montserrat-semibold text-right">
                  Áp dụng
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 border-t border-border-light"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button variant="gradient" onPress={handleConfirm} fullWidth>
          Xác nhận
        </Button>
      </View>
    </View>
  );
}
