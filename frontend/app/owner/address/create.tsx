/**
 * Create Address Screen
 * Form to create a new address
 */
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { addressesApi } from "@/src/api/addresses";
import { colors } from "@/src/constants/theme";
import { showToast } from "@/src/components/ui/toast";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import type { CreateAddressRequest } from "@/src/types";

// Default HCM coordinates
const DEFAULT_LAT = 10.7769;
const DEFAULT_LNG = 106.7009;

export default function CreateAddressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // Form state
  const [addressText, setAddressText] = useState("");
  const [latitude, setLatitude] = useState(DEFAULT_LAT.toString());
  const [longitude, setLongitude] = useState(DEFAULT_LNG.toString());

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAddressRequest) => addressesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "addresses"] });
      showToast("Đã tạo địa chỉ mới", "success");
      router.back();
    },
    onError: (error: Error) => {
      showToast(error.message || "Không thể tạo địa chỉ", "error");
    },
  });

  const handleSubmit = () => {
    // Validation
    if (!addressText.trim()) {
      showToast("Vui lòng nhập địa chỉ", "error");
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      showToast("Vĩ độ không hợp lệ (từ -90 đến 90)", "error");
      return;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      showToast("Kinh độ không hợp lệ (từ -180 đến 180)", "error");
      return;
    }

    createMutation.mutate({
      addressText: addressText.trim(),
      latitude: lat,
      longitude: lng,
    });
  };

  // Reset to default HCM coordinates
  const handleResetCoords = () => {
    setLatitude(DEFAULT_LAT.toString());
    setLongitude(DEFAULT_LNG.toString());
    showToast("Đã đặt lại tọa độ mặc định (TP.HCM)", "info");
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title="Thêm địa chỉ" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
      >
        {/* Address Text */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Địa chỉ <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border border-border-light"
            placeholder="VD: 123 Nguyễn Văn Linh, Quận 7, TP.HCM"
            value={addressText}
            onChangeText={setAddressText}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor={colors.textTertiary}
            style={{ minHeight: 80 }}
          />
        </View>

        {/* Coordinates Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-montserrat-medium text-text-primary">Tọa độ</Text>
            <Pressable onPress={handleResetCoords} className="flex-row items-center">
              <Ionicons name="refresh" size={14} color={colors.primary} />
              <Text className="text-sm font-montserrat-medium text-primary ml-1">Mặc định</Text>
            </Pressable>
          </View>

          <View className="bg-white rounded-xl p-4 border border-border-light">
            {/* Latitude */}
            <View className="mb-3">
              <Text className="text-xs font-montserrat-medium text-text-secondary mb-1">
                Vĩ độ (Latitude)
              </Text>
              <TextInput
                className="bg-background-secondary rounded-lg px-3 py-2 font-montserrat-regular text-text-primary"
                placeholder="10.7769"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            {/* Longitude */}
            <View>
              <Text className="text-xs font-montserrat-medium text-text-secondary mb-1">
                Kinh độ (Longitude)
              </Text>
              <TextInput
                className="bg-background-secondary rounded-lg px-3 py-2 font-montserrat-regular text-text-primary"
                placeholder="106.7009"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 rounded-xl p-4 flex-row">
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text className="text-blue-700 text-sm font-montserrat-regular ml-2 flex-1">
            Bạn có thể lấy tọa độ từ Google Maps bằng cách nhấn giữ vào vị trí và sao chép tọa độ.
          </Text>
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
            {createMutation.isPending ? "Đang xử lý..." : "Tạo địa chỉ"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
