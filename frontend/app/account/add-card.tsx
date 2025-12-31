/**
 * Add Card Screen
 * Add new credit/debit card (UI only)
 */
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ScreenHeader } from "@/src/components/layout/screen-header";
import { TextInput } from "@/src/components/ui/text-input";
import { Button } from "@/src/components/ui/button";
import { showToast } from "@/src/components/ui/toast";
import { colors } from "@/src/constants/theme";

// Simple card validation helpers
const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
};

const formatExpiry = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

const validateCardNumber = (value: string): boolean => {
  const cleaned = value.replace(/\s/g, "");
  return cleaned.length === 16 && /^\d+$/.test(cleaned);
};

const validateExpiry = (value: string): boolean => {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);
  return month >= 1 && month <= 12 && year >= 24;
};

const validateCvv = (value: string): boolean => {
  return value.length >= 3 && value.length <= 4 && /^\d+$/.test(value);
};

export default function AddCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const isCardNameValid = cardName.trim().length >= 2;
  const isCardNumberValid = validateCardNumber(cardNumber);
  const isExpiryValid = validateExpiry(expiry);
  const isCvvValid = validateCvv(cvv);
  const isFormValid = isCardNameValid && isCardNumberValid && isExpiryValid && isCvvValid;

  const handleCardNumberChange = useCallback((text: string) => {
    const formatted = formatCardNumber(text.replace(/\s/g, "").slice(0, 16));
    setCardNumber(formatted);
  }, []);

  const handleExpiryChange = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    const formatted = formatExpiry(cleaned);
    setExpiry(formatted);
  }, []);

  const handleCvvChange = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    setCvv(cleaned);
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    showToast("Đã thêm thẻ mới", "success");
    router.back();
  };

  const getCardType = (number: string): string => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "Visa";
    if (cleaned.startsWith("5")) return "Mastercard";
    if (cleaned.startsWith("34") || cleaned.startsWith("37")) return "Amex";
    return "";
  };

  const cardType = getCardType(cardNumber);

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title="Thêm thẻ thanh toán" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card Preview */}
          <View className="mx-4 mt-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 h-48 justify-between"
            style={{
              backgroundColor: "#1a1a2e",
            }}
          >
            <View className="flex-row justify-between items-center">
              <Ionicons name="card" size={32} color="white" />
              {cardType && (
                <Text className="text-white text-lg font-montserrat-bold">
                  {cardType}
                </Text>
              )}
            </View>

            <Text className="text-white text-xl font-montserrat-medium tracking-widest">
              {cardNumber || "•••• •••• •••• ••••"}
            </Text>

            <View className="flex-row justify-between">
              <View>
                <Text className="text-white/60 text-xs font-montserrat-regular">
                  TÊN CHỦ THẺ
                </Text>
                <Text className="text-white text-sm font-montserrat-medium mt-1">
                  {cardName.toUpperCase() || "NGUYEN VAN A"}
                </Text>
              </View>
              <View>
                <Text className="text-white/60 text-xs font-montserrat-regular">
                  NGÀY HẾT HẠN
                </Text>
                <Text className="text-white text-sm font-montserrat-medium mt-1">
                  {expiry || "MM/YY"}
                </Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View className="bg-white mt-4 p-4">
            {/* Card Name */}
            <View className="mb-4">
              <TextInput
                label="Tên trên thẻ"
                value={cardName}
                onChangeText={setCardName}
                placeholder="NGUYEN VAN A"
                autoCapitalize="characters"
                isValid={cardName.length > 0 ? isCardNameValid : undefined}
              />
            </View>

            {/* Card Number */}
            <View className="mb-4">
              <TextInput
                label="Số thẻ"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                isValid={cardNumber.length > 0 ? isCardNumberValid : undefined}
                rightIcon={
                  isCardNumberValid ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  ) : undefined
                }
              />
            </View>

            {/* Expiry & CVV */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <TextInput
                  label="Ngày hết hạn"
                  value={expiry}
                  onChangeText={handleExpiryChange}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  isValid={expiry.length > 0 ? isExpiryValid : undefined}
                />
              </View>
              <View className="flex-1">
                <TextInput
                  label="CVV"
                  value={cvv}
                  onChangeText={handleCvvChange}
                  placeholder="123"
                  keyboardType="numeric"
                  secureTextEntry
                  isValid={cvv.length > 0 ? isCvvValid : undefined}
                />
              </View>
            </View>
          </View>

          {/* Security Note */}
          <View className="mx-4 mt-4 p-4 bg-success-light rounded-xl">
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark" size={20} color={colors.success} />
              <Text className="flex-1 ml-2 text-success text-sm font-montserrat-medium">
                Thanh toán an toàn và bảo mật
              </Text>
            </View>
            <Text className="text-text-secondary text-xs font-montserrat-regular mt-2">
              Thông tin thẻ của bạn được mã hóa và lưu trữ an toàn theo tiêu chuẩn PCI-DSS.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 border-t border-border-light"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          variant="gradient"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!isFormValid}
          fullWidth
        >
          Thêm thẻ
        </Button>
      </View>
    </View>
  );
}
