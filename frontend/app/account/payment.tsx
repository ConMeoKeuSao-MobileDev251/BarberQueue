/**
 * Payment Methods Screen
 * Manage saved payment methods (UI only - no backend integration)
 */
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Image } from "expo-image";

import { ScreenHeader } from "@/src/components/layout/screen-header";
import { ConfirmDialog } from "@/src/components/layout/modal";
import { BottomSheet } from "@/src/components/layout/bottom-sheet";
import { showToast } from "@/src/components/ui/toast";
import { colors } from "@/src/constants/theme";

// Payment method icons
const PAYMENT_ICONS: Record<string, number> = {
  cash: require("../../assets/icons/cash.png"),
  momo: require("../../assets/icons/momo.png"),
  vnpay: require("../../assets/icons/vnpay.jpg"),
};

interface PaymentMethod {
  id: string;
  type: "apple_pay" | "cash" | "card" | "momo" | "vnpay";
  label: string;
  details?: string;
  icon: keyof typeof Ionicons.glyphMap; // Fallback icon
  customIcon?: number; // Local asset
}

// Mock payment methods data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "apple_pay",
    label: "Apple Pay",
    icon: "logo-apple",
  },
  {
    id: "2",
    type: "cash",
    label: "Tiền mặt",
    icon: "cash-outline",
    customIcon: PAYMENT_ICONS.cash,
  },
  {
    id: "3",
    type: "momo",
    label: "MoMo",
    icon: "wallet-outline",
    customIcon: PAYMENT_ICONS.momo,
  },
  {
    id: "4",
    type: "vnpay",
    label: "VNPay",
    icon: "card-outline",
    customIcon: PAYMENT_ICONS.vnpay,
  },
  {
    id: "5",
    type: "card",
    label: "Visa",
    details: "•••• 4242",
    icon: "card-outline",
  },
];

// Payment type options for adding new
const paymentTypeOptions = [
  { id: "momo", label: "Ví MoMo", icon: "wallet-outline" as const, customIcon: PAYMENT_ICONS.momo },
  { id: "vnpay", label: "VNPay", icon: "card-outline" as const, customIcon: PAYMENT_ICONS.vnpay },
  { id: "cash", label: "Tiền mặt", icon: "cash-outline" as const, customIcon: PAYMENT_ICONS.cash },
  { id: "card", label: "Thẻ tín dụng/ghi nợ", icon: "card-outline" as const },
];

// Payment icon component
function PaymentIcon({ method }: { method: PaymentMethod }) {
  if (method.customIcon) {
    return (
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center overflow-hidden">
        <Image
          source={method.customIcon}
          style={{ width: 28, height: 28 }}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
      <Ionicons name={method.icon} size={20} color={colors.textPrimary} />
    </View>
  );
}

export default function PaymentMethodsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [addSheetVisible, setAddSheetVisible] = useState(false);

  const handleDeletePress = (id: string) => {
    setSelectedMethodId(id);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMethodId) {
      setPaymentMethods((prev) => prev.filter((m) => m.id !== selectedMethodId));
      showToast("Đã xóa phương thức thanh toán", "success");
    }
    setDeleteModalVisible(false);
    setSelectedMethodId(null);
  };

  const handleAddPaymentType = (typeId: string) => {
    setAddSheetVisible(false);
    if (typeId === "card") {
      router.push("/account/add-card" as never);
    } else {
      // For other types, just show a toast (UI placeholder)
      showToast("Tính năng đang phát triển", "info");
    }
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title={t("account.payment")} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Payment Methods List */}
        <View className="bg-white mt-4">
          {paymentMethods.map((method, index) => (
            <View
              key={method.id}
              className={`flex-row items-center px-4 py-4 ${
                index < paymentMethods.length - 1 ? "border-b border-border-light" : ""
              }`}
            >
              {/* Icon */}
              <PaymentIcon method={method} />

              {/* Label */}
              <View className="flex-1 ml-3">
                <Text className="text-text-primary text-md font-montserrat-medium">
                  {method.label}
                </Text>
                {method.details && (
                  <Text className="text-text-secondary text-sm font-montserrat-regular">
                    {method.details}
                  </Text>
                )}
              </View>

              {/* Delete button (only for cards) */}
              {method.type === "card" && (
                <Pressable onPress={() => handleDeletePress(method.id)}>
                  <Text className="text-coral text-sm font-montserrat-medium">
                    Xóa
                  </Text>
                </Pressable>
              )}
            </View>
          ))}

          {/* Add Payment Method */}
          <Pressable
            onPress={() => setAddSheetVisible(true)}
            className="flex-row items-center px-4 py-4 border-t border-border-light"
          >
            <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center">
              <Ionicons name="add" size={24} color={colors.primary} />
            </View>
            <Text className="flex-1 ml-3 text-primary text-md font-montserrat-medium">
              Thêm phương thức thanh toán
            </Text>
          </Pressable>
        </View>

        {/* Info Note */}
        <View className="mx-4 mt-4 p-4 bg-primary-light rounded-xl">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text className="flex-1 ml-2 text-text-secondary text-sm font-montserrat-regular">
              Thông tin thanh toán của bạn được bảo mật và mã hóa theo tiêu chuẩn PCI-DSS.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa thẻ?"
        message="Bạn có chắc muốn xóa thẻ này? Bạn sẽ cần thêm lại nếu muốn sử dụng."
        confirmLabel="Xóa"
        cancelLabel={t("common.cancel")}
        destructive
      />

      {/* Add Payment Method Bottom Sheet */}
      <BottomSheet
        visible={addSheetVisible}
        onClose={() => setAddSheetVisible(false)}
        title="Thêm phương thức thanh toán"
      >
        <View className="pb-4">
          {paymentTypeOptions.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => handleAddPaymentType(option.id)}
              className="flex-row items-center py-4 border-b border-border-light"
            >
              {"customIcon" in option && option.customIcon ? (
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center overflow-hidden">
                  <Image
                    source={option.customIcon}
                    style={{ width: 28, height: 28 }}
                    contentFit="contain"
                  />
                </View>
              ) : (
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons name={option.icon} size={20} color={colors.textPrimary} />
                </View>
              )}
              <Text className="flex-1 ml-3 text-text-primary text-md font-montserrat-medium">
                {option.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}
