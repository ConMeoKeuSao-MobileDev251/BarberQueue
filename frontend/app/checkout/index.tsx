/**
 * Checkout Screen
 * Review cart, select stylist/time, and confirm booking
 */
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { useCartStore, useCartTotalItems, useCartTotalPrice, useCartTotalDuration } from "@/src/stores";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { QuantityStepper } from "@/src/components/shared/quantity-stepper";
import { ConfirmDialog } from "@/src/components/layout/modal";
import { EmptyCart } from "@/src/components/ui/empty-state";
import { colors } from "@/src/constants/theme";

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    items,
    branchName,
    staffName,
    dateTime,
    updateQuantity,
    removeItem,
  } = useCartStore();
  const totalItems = useCartTotalItems();
  const totalPrice = useCartTotalPrice();
  const totalDuration = useCartTotalDuration();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} phút`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hours}h${remainingMins}p` : `${hours} giờ`;
  };

  const handleDeletePress = (serviceId: number) => {
    setSelectedItemId(serviceId);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItemId) {
      removeItem(selectedItemId);
    }
    setDeleteModalVisible(false);
    setSelectedItemId(null);
  };

  const handleSelectStylist = () => {
    router.push("/checkout/stylist" as never);
  };

  const handleSelectDateTime = () => {
    router.push("/checkout/datetime" as never);
  };

  const handleViewPromos = () => {
    router.push("/checkout/promos" as never);
  };

  const handleContinue = () => {
    if (!staffName || !dateTime) {
      handleSelectStylist();
    } else {
      router.push("/checkout/success" as never);
    }
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-background-secondary">
        <ScreenHeader title={t("checkout.title")} />
        <EmptyCart onAction={() => router.back()} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title={t("checkout.title")} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Shop & Stylist Info */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <Text className="text-text-primary text-lg font-montserrat-bold">
            {branchName || "Barbershop"}
          </Text>

          {/* Stylist Selection */}
          <Pressable
            onPress={handleSelectStylist}
            className="flex-row items-center mt-3 py-3 border-t border-border-light"
          >
            <Avatar source={null} name={staffName || "?"} size="md" />
            <View className="flex-1 ml-3">
              <Text className="text-text-secondary text-sm font-montserrat-regular">
                {t("checkout.selectStylist")}
              </Text>
              <Text className="text-text-primary text-md font-montserrat-medium">
                {staffName || "Chọn thợ"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>

          {/* Date/Time Selection */}
          <Pressable
            onPress={handleSelectDateTime}
            className="flex-row items-center py-3 border-t border-border-light"
          >
            <View className="w-12 h-12 rounded-full bg-primary-light items-center justify-center">
              <Ionicons name="calendar" size={24} color={colors.primary} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-text-secondary text-sm font-montserrat-regular">
                {t("checkout.selectDate")}
              </Text>
              <Text className="text-text-primary text-md font-montserrat-medium">
                {dateTime || "Chọn ngày & giờ"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>
        </View>

        {/* Cart Items */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <Text className="text-text-primary text-md font-montserrat-semibold mb-3">
            Dịch vụ đã chọn ({totalItems})
          </Text>

          {items.map((item, index) => (
            <View
              key={item.service.id}
              className={`flex-row items-center py-4 ${
                index < items.length - 1 ? "border-b border-border-light" : ""
              }`}
            >
              <View className="flex-1">
                <Text className="text-text-primary text-md font-montserrat-medium">
                  {item.service.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-primary text-md font-montserrat-bold">
                    {formatPrice(item.service.price)}
                  </Text>
                  <Text className="text-text-tertiary text-sm font-montserrat-regular ml-2">
                    • {formatDuration(item.service.duration)}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(value) => {
                    if (value === 0) {
                      handleDeletePress(item.service.id);
                    } else {
                      updateQuantity(item.service.id, value);
                    }
                  }}
                  min={0}
                  size="sm"
                />
                <Pressable
                  onPress={() => handleDeletePress(item.service.id)}
                  className="p-2"
                >
                  <Ionicons name="trash-outline" size={20} color={colors.coral} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Section */}
        <Pressable
          onPress={handleViewPromos}
          className="bg-white mx-4 mt-4 rounded-xl p-4 flex-row items-center"
        >
          <Ionicons name="pricetag" size={24} color={colors.primary} />
          <Text className="flex-1 ml-3 text-text-primary text-md font-montserrat-medium">
            {t("checkout.promo")}
          </Text>
          <Text className="text-primary text-sm font-montserrat-medium mr-1">
            {t("checkout.viewPromos")}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </Pressable>

        {/* Price Summary */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <View className="flex-row justify-between py-2">
            <Text className="text-text-secondary text-md font-montserrat-regular">
              {t("checkout.subtotal")}
            </Text>
            <Text className="text-text-primary text-md font-montserrat-medium">
              {formatPrice(totalPrice)}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-text-secondary text-md font-montserrat-regular">
              {t("checkout.discount")}
            </Text>
            <Text className="text-success text-md font-montserrat-medium">
              -0đ
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-t border-border-light mt-2">
            <Text className="text-text-primary text-lg font-montserrat-bold">
              {t("checkout.total")}
            </Text>
            <Text className="text-primary text-lg font-montserrat-bold">
              {formatPrice(totalPrice)}
            </Text>
          </View>
          <Text className="text-text-tertiary text-sm font-montserrat-regular mt-1">
            Thời gian ước tính: {formatDuration(totalDuration)}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 border-t border-border-light"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button variant="gradient" onPress={handleContinue} fullWidth>
          {t("checkout.confirmBooking")}
        </Button>
      </View>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title={t("checkout.deleteService")}
        message={t("checkout.deleteConfirm")}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        destructive
      />
    </View>
  );
}
