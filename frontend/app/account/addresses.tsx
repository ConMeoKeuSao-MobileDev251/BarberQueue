/**
 * Address List Screen
 * Manage saved addresses with edit and delete functionality
 */
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { addressesApi } from "@/src/api/addresses";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { ConfirmDialog } from "@/src/components/layout/modal";
import { SkeletonListItem } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";
import { showToast } from "@/src/components/ui/toast";
import { colors } from "@/src/constants/theme";

export default function AddressesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Fetch addresses
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressesApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: addressesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast("Đã xóa địa chỉ", "success");
      setDeleteModalVisible(false);
      setSelectedAddressId(null);
    },
    onError: () => {
      showToast("Không thể xóa địa chỉ", "error");
    },
  });

  const handleDeletePress = (id: number) => {
    setSelectedAddressId(id);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAddressId) {
      deleteMutation.mutate(selectedAddressId);
    }
  };

  const handleAddAddress = () => {
    router.push("/account/address-search" as never);
  };

  const getAddressIcon = (addressText: string): keyof typeof Ionicons.glyphMap => {
    const lowerText = addressText.toLowerCase();
    if (lowerText.includes("nhà") || lowerText.includes("home")) return "home";
    if (lowerText.includes("công ty") || lowerText.includes("office")) return "business";
    if (lowerText.includes("trường") || lowerText.includes("school")) return "school";
    return "location";
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader
        title={t("account.addresses")}
        rightAction={
          <Pressable onPress={handleAddAddress} className="p-2">
            <Ionicons name="add" size={24} color={colors.primary} />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20, flexGrow: 1 }}
      >
        {isLoading ? (
          <View className="bg-white mt-4 p-4">
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
          </View>
        ) : addresses && addresses.length > 0 ? (
          <View className="bg-white mt-4">
            {addresses.map((address, index) => (
              <View
                key={address.id}
                className={`px-4 py-4 ${
                  index < addresses.length - 1 ? "border-b border-dashed border-border-light" : ""
                }`}
              >
                <View className="flex-row items-start">
                  {/* Icon */}
                  <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center">
                    <Ionicons
                      name={getAddressIcon(address.addressText)}
                      size={20}
                      color={colors.primary}
                    />
                  </View>

                  {/* Address Info */}
                  <View className="flex-1 ml-3">
                    <Text className="text-text-primary text-md font-montserrat-semibold">
                      {address.addressText.split(",")[0] || "Địa chỉ"}
                    </Text>
                    <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                      {address.addressText}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row justify-end mt-3 gap-4">
                  <Pressable onPress={() => handleDeletePress(address.id)}>
                    <Text className="text-coral text-sm font-montserrat-medium">
                      Xóa
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center">
            <EmptyState
              icon="location-outline"
              title="Chưa có địa chỉ"
              description="Thêm địa chỉ để đặt lịch nhanh hơn"
              actionLabel="Thêm địa chỉ"
              onAction={handleAddAddress}
            />
          </View>
        )}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa địa chỉ?"
        message="Bạn có chắc muốn xóa địa chỉ này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        cancelLabel={t("common.cancel")}
        destructive
      />
    </View>
  );
}
