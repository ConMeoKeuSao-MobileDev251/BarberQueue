/**
 * Create Service Screen
 * Form to create a new barber service
 */
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { servicesApi } from "@/src/api/services";
import { colors } from "@/src/constants/theme";
import { showToast } from "@/src/components/ui/toast";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import type { CreateServiceRequest } from "@/src/types";

export default function CreateServiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateServiceRequest) => servicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "services"] });
      showToast("Đã tạo dịch vụ mới", "success");
      router.back();
    },
    onError: (error: Error) => {
      showToast(error.message || "Không thể tạo dịch vụ", "error");
    },
  });

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      showToast("Vui lòng nhập tên dịch vụ", "error");
      return;
    }

    const priceNum = parseInt(price.replace(/\D/g, ""), 10);
    if (!priceNum || priceNum <= 0) {
      showToast("Vui lòng nhập giá hợp lệ", "error");
      return;
    }

    const durationNum = parseInt(duration, 10);
    if (!durationNum || durationNum <= 0) {
      showToast("Vui lòng nhập thời gian hợp lệ", "error");
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      price: priceNum,
      duration: durationNum,
    });
  };

  // Format price input
  const handlePriceChange = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/\D/g, "");
    // Format with thousand separators
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setPrice(formatted);
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title="Thêm dịch vụ" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
      >
        {/* Service Name */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Tên dịch vụ <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border border-border-light"
            placeholder="VD: Cắt tóc, Gội đầu, Uốn tóc..."
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Price */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Giá (VNĐ) <Text className="text-danger">*</Text>
          </Text>
          <View className="flex-row items-center bg-white rounded-xl border border-border-light">
            <TextInput
              className="flex-1 px-4 py-3 font-montserrat-regular text-text-primary"
              placeholder="50.000"
              value={price}
              onChangeText={handlePriceChange}
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
            />
            <Text className="pr-4 text-text-secondary font-montserrat-medium">đ</Text>
          </View>
        </View>

        {/* Duration */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Thời gian (phút) <Text className="text-danger">*</Text>
          </Text>
          <View className="flex-row items-center bg-white rounded-xl border border-border-light">
            <TextInput
              className="flex-1 px-4 py-3 font-montserrat-regular text-text-primary"
              placeholder="30"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
            />
            <Text className="pr-4 text-text-secondary font-montserrat-medium">phút</Text>
          </View>
        </View>

        {/* Quick Duration Options */}
        <View className="mb-4">
          <Text className="text-xs font-montserrat-medium text-text-tertiary mb-2">
            Chọn nhanh:
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {[15, 30, 45, 60, 90, 120].map((mins) => (
              <Pressable
                key={mins}
                onPress={() => setDuration(mins.toString())}
                className={`px-3 py-1.5 rounded-full ${
                  duration === mins.toString() ? "bg-primary" : "bg-white border border-border-light"
                }`}
              >
                <Text
                  className={`text-sm font-montserrat-medium ${
                    duration === mins.toString() ? "text-white" : "text-text-primary"
                  }`}
                >
                  {mins} phút
                </Text>
              </Pressable>
            ))}
          </View>
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
            {createMutation.isPending ? "Đang xử lý..." : "Tạo dịch vụ"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
