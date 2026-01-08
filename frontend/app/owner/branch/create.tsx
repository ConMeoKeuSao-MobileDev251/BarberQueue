/**
 * Create Branch Screen
 * Form to create a new branch
 */
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { branchesApi } from "@/src/api/branches";
import { addressesApi } from "@/src/api/addresses";
import { colors } from "@/src/constants/theme";
import { showToast } from "@/src/components/ui/toast";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import type { CreateBranchRequest } from "@/src/types";

export default function CreateBranchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Fetch addresses
  const { data: addresses = [] } = useQuery({
    queryKey: ["owner", "addresses"],
    queryFn: addressesApi.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateBranchRequest) => branchesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "branches"] });
      showToast("Đã tạo chi nhánh mới", "success");
      router.back();
    },
    onError: (error: Error) => {
      showToast(error.message || "Không thể tạo chi nhánh", "error");
    },
  });

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      showToast("Vui lòng nhập tên chi nhánh", "error");
      return;
    }
    if (!phoneNumber.trim()) {
      showToast("Vui lòng nhập số điện thoại", "error");
      return;
    }
    if (!selectedAddressId) {
      showToast("Vui lòng chọn địa chỉ", "error");
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      addressId: selectedAddressId,
    });
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title="Thêm chi nhánh" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
      >
        {/* Branch Name */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Tên chi nhánh <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border border-border-light"
            placeholder="VD: 30Shine Thủ Đức"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Số điện thoại <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border border-border-light"
            placeholder="Nhập số điện thoại chi nhánh"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Address Selection */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-montserrat-medium text-text-primary">
              Địa chỉ <Text className="text-danger">*</Text>
            </Text>
            <Pressable onPress={() => router.push("/owner/address/create" as never)}>
              <Text className="text-sm font-montserrat-medium text-primary">+ Thêm mới</Text>
            </Pressable>
          </View>

          <View className="gap-2">
            {addresses.map((address) => (
              <Pressable
                key={address.id}
                onPress={() => setSelectedAddressId(address.id)}
                className={`px-4 py-3 rounded-xl border ${
                  selectedAddressId === address.id
                    ? "bg-primary/10 border-primary"
                    : "bg-white border-border-light"
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={selectedAddressId === address.id ? "radio-button-on" : "radio-button-off"}
                    size={20}
                    color={selectedAddressId === address.id ? colors.primary : colors.textTertiary}
                  />
                  <Text
                    className="text-sm font-montserrat-regular text-text-primary ml-2 flex-1"
                    numberOfLines={2}
                  >
                    {address.addressText}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {addresses.length === 0 && (
            <View className="bg-white rounded-xl p-4 items-center">
              <Ionicons name="location-outline" size={32} color={colors.textTertiary} />
              <Text className="text-text-tertiary text-sm font-montserrat-regular mt-2 text-center">
                Chưa có địa chỉ nào.{"\n"}Vui lòng tạo địa chỉ trước.
              </Text>
              <Pressable
                onPress={() => router.push("/owner/address/create" as never)}
                className="mt-3 bg-primary px-4 py-2 rounded-full"
              >
                <Text className="text-white font-montserrat-medium">Tạo địa chỉ</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-border-light px-4 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={createMutation.isPending}
          className={`bg-primary py-4 rounded-xl items-center ${createMutation.isPending ? "opacity-70" : ""}`}
        >
          <Text className="text-white font-montserrat-semibold text-base">
            {createMutation.isPending ? "Đang xử lý..." : "Tạo chi nhánh"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
