/**
 * Promo Codes Screen
 * Apply promotional codes to booking
 */
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { ScreenHeader } from "@/src/components/layout/screen-header";
import { TextInput } from "@/src/components/ui/text-input";
import { Button } from "@/src/components/ui/button";
import { colors } from "@/src/constants/theme";

// Mock promos
const availablePromos = [
  {
    id: "1",
    code: "WELCOME20",
    title: "Giảm 20% lần đầu",
    description: "Áp dụng cho tất cả dịch vụ",
    provider: "BarberQueue",
  },
  {
    id: "2",
    code: "COMBO50K",
    title: "Giảm 50K combo",
    description: "Đơn hàng từ 200K",
    provider: "BarberQueue",
  },
];

export default function PromosScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handleApplyCode = () => {
    setError(null);
    setIsValid(false);

    const promo = availablePromos.find(
      (p) => p.code.toLowerCase() === promoCode.toLowerCase()
    );

    if (promo) {
      setAppliedCode(promo.code);
      setIsValid(true);
    } else {
      setError("Mã giảm giá không hợp lệ");
    }
  };

  const handleSelectPromo = (code: string) => {
    setPromoCode(code);
    setAppliedCode(code);
    setIsValid(true);
    setError(null);
  };

  const handleConfirm = () => {
    // TODO: Apply promo to cart
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
                value={promoCode}
                onChangeText={(text) => {
                  setPromoCode(text);
                  setError(null);
                  setIsValid(false);
                }}
                placeholder="Nhập mã giảm giá"
                error={error || undefined}
                isValid={isValid}
              />
            </View>
            <Button
              variant="text"
              onPress={handleApplyCode}
              disabled={!promoCode.trim()}
            >
              ÁP DỤNG
            </Button>
          </View>
        </View>

        {/* Applied Promo */}
        {appliedCode && isValid && (
          <View className="bg-success-light mx-4 mt-4 p-4 rounded-xl flex-row items-center">
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text className="flex-1 ml-3 text-success text-md font-montserrat-medium">
              Đã áp dụng mã {appliedCode}
            </Text>
            <Pressable
              onPress={() => {
                setAppliedCode(null);
                setPromoCode("");
                setIsValid(false);
              }}
            >
              <Ionicons name="close-circle" size={24} color={colors.success} />
            </Pressable>
          </View>
        )}

        {/* Available Promos */}
        <View className="p-4 mt-4">
          <Text className="text-text-primary text-md font-montserrat-semibold mb-3">
            Khuyến mãi có sẵn
          </Text>

          <View className="gap-3">
            {availablePromos.map((promo) => (
              <View
                key={promo.id}
                className="bg-white rounded-xl p-4 border border-border-light"
              >
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-lg bg-primary-light items-center justify-center">
                    <Ionicons name="pricetag" size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-text-primary text-md font-montserrat-semibold">
                      {promo.title}
                    </Text>
                    <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                      {promo.description}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <View className="bg-gray-100 px-2 py-1 rounded">
                        <Text className="text-text-primary text-xs font-montserrat-medium">
                          {promo.code}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() => handleSelectPromo(promo.code)}
                  className="mt-3 py-2"
                >
                  <Text className="text-primary text-sm font-montserrat-semibold text-right">
                    Áp dụng
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 border-t border-border-light"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          variant="gradient"
          onPress={handleConfirm}
          fullWidth
        >
          Xác nhận
        </Button>
      </View>
    </View>
  );
}
