/**
 * Create Staff Screen
 * Form to register a new staff member
 */
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { authApi } from "@/src/api/auth";
import { branchesApi } from "@/src/api/branches";
import { addressesApi } from "@/src/api/addresses";
import { colors } from "@/src/constants/theme";
import { showToast } from "@/src/components/ui/toast";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import type { RegisterStaffOwnerRequest } from "@/src/types";

export default function CreateStaffScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Fetch branches
  const { data: branches = [] } = useQuery({
    queryKey: ["owner", "branches"],
    queryFn: branchesApi.getAll,
  });

  // Fetch addresses
  const { data: addresses = [] } = useQuery({
    queryKey: ["owner", "addresses"],
    queryFn: addressesApi.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: RegisterStaffOwnerRequest) => authApi.registerStaffOrOwner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "all-staff"] });
      showToast("Đã thêm nhân viên mới", "success");
      router.back();
    },
    onError: (error: Error) => {
      showToast(error.message || "Không thể thêm nhân viên", "error");
    },
  });

  const handleSubmit = () => {
    // Validation
    if (!fullName.trim()) {
      showToast("Vui lòng nhập họ tên", "error");
      return;
    }
    if (!phoneNumber.trim()) {
      showToast("Vui lòng nhập số điện thoại", "error");
      return;
    }
    if (!password.trim() || password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
      return;
    }
    if (!selectedBranchId) {
      showToast("Vui lòng chọn chi nhánh", "error");
      return;
    }
    if (!selectedAddressId) {
      showToast("Vui lòng chọn địa chỉ", "error");
      return;
    }

    createMutation.mutate({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      password: password.trim(),
      email: email.trim() || undefined,
      role: "staff",
      branchId: selectedBranchId,
      addressId: selectedAddressId,
    });
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title="Thêm nhân viên" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
      >
        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Họ và tên <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border border-border-light"
            placeholder="Nhập họ và tên"
            value={fullName}
            onChangeText={setFullName}
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
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Mật khẩu <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border border-border-light"
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">Email</Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border border-border-light"
            placeholder="Nhập email (không bắt buộc)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Branch Selection */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Chi nhánh <Text className="text-danger">*</Text>
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {branches.map((branch) => (
              <Pressable
                key={branch.id}
                onPress={() => setSelectedBranchId(branch.id)}
                className={`px-4 py-2 rounded-full border ${
                  selectedBranchId === branch.id
                    ? "bg-primary border-primary"
                    : "bg-white border-border-light"
                }`}
              >
                <Text
                  className={`text-sm font-montserrat-medium ${
                    selectedBranchId === branch.id ? "text-white" : "text-text-primary"
                  }`}
                >
                  {branch.name}
                </Text>
              </Pressable>
            ))}
          </View>
          {branches.length === 0 && (
            <Text className="text-text-tertiary text-sm font-montserrat-regular mt-2">
              Chưa có chi nhánh. Vui lòng tạo chi nhánh trước.
            </Text>
          )}
        </View>

        {/* Address Selection */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Địa chỉ <Text className="text-danger">*</Text>
          </Text>
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
            <Text className="text-text-tertiary text-sm font-montserrat-regular mt-2">
              Chưa có địa chỉ. Vui lòng tạo địa chỉ trước.
            </Text>
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
            {createMutation.isPending ? "Đang xử lý..." : "Thêm nhân viên"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
