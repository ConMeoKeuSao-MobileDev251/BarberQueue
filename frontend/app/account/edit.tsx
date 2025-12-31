/**
 * Profile Edit Screen
 * Edit user profile information
 */
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { usersApi } from "@/src/api/users";
import { useAuthStore } from "@/src/stores";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { Button } from "@/src/components/ui/button";
import { FormInput } from "@/src/components/form/form-input";
import { FormPhoneInput } from "@/src/components/form/form-phone-input";
import { Avatar } from "@/src/components/ui/avatar";
import { showToast } from "@/src/components/ui/toast";
import { colors } from "@/src/constants/theme";

// Validation schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { control, handleSubmit } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => {
      if (!user?.id) throw new Error("User not found");
      return usersApi.update(user.id, {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email || undefined,
      });
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showToast("Đã cập nhật thông tin", "success");
      router.back();
    },
    onError: () => {
      showToast("Không thể cập nhật thông tin", "error");
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title={t("account.editProfile")} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View className="bg-white items-center py-6 mt-4">
            <View className="relative">
              <Avatar
                source={null}
                name={user?.fullName || "User"}
                size="xl"
              />
              {/* Edit avatar button - placeholder */}
              <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary items-center justify-center border-2 border-white">
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </View>
            <Text className="text-text-tertiary text-sm font-montserrat-regular mt-3">
              Nhấn để thay đổi ảnh
            </Text>
          </View>

          {/* Form Section */}
          <View className="bg-white mt-4 p-4">
            {/* Full Name */}
            <View className="mb-4">
              <FormInput
                control={control}
                name="fullName"
                label={t("auth.fullName")}
                placeholder="Nguyễn Văn A"
                autoCapitalize="words"
                leftIcon={
                  <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                }
              />
            </View>

            {/* Phone */}
            <View className="mb-4">
              <FormPhoneInput
                control={control}
                name="phoneNumber"
                label={t("auth.phoneNumber")}
                placeholder="912 345 678"
              />
            </View>

            {/* Email */}
            <View className="mb-4">
              <FormInput
                control={control}
                name="email"
                label={`${t("auth.email")} (tuỳ chọn)`}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={
                  <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                }
              />
            </View>
          </View>

          {/* Account Info */}
          <View className="bg-white mt-4 p-4">
            <Text className="text-text-secondary text-sm font-montserrat-regular mb-2">
              ID tài khoản
            </Text>
            <Text className="text-text-primary text-md font-montserrat-medium">
              #{user?.id || "---"}
            </Text>

            <Text className="text-text-secondary text-sm font-montserrat-regular mt-4 mb-2">
              Ngày tham gia
            </Text>
            <Text className="text-text-primary text-md font-montserrat-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                : "---"}
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
          onPress={handleSubmit(onSubmit)}
          loading={updateMutation.isPending}
          fullWidth
        >
          Lưu thay đổi
        </Button>
      </View>
    </View>
  );
}
