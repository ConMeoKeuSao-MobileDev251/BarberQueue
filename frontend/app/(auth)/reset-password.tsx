/**
 * Reset Password Screen
 * Enter token from email and new password
 */
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { authApi } from "@/src/api/auth";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { Button } from "@/src/components/ui/button";
import { FormInput } from "@/src/components/form/form-input";
import { showToast } from "@/src/components/ui/toast";
import { colors } from "@/src/constants/theme";

// Validation schema
const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Mã xác nhận là bắt buộc"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  confirmPassword: z.string().min(6, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      resetToken: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      showToast("Đặt lại mật khẩu thành công", "success");
      router.replace("/(auth)/login" as never);
    },
    onError: (error: Error) => {
      showToast(error.message || "Không thể đặt lại mật khẩu", "error");
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate({
      resetToken: data.resetToken,
      password: data.password,
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Đặt lại mật khẩu" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-8">
            {/* Icon */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-primary-light items-center justify-center mb-4">
                <Ionicons name="key-outline" size={40} color={colors.primary} />
              </View>
              <Text className="text-text-primary text-xl font-montserrat-bold text-center">
                Tạo mật khẩu mới
              </Text>
              <Text className="text-text-secondary text-sm font-montserrat-regular text-center mt-2 px-4">
                Nhập mã xác nhận từ email và mật khẩu mới
              </Text>
            </View>

            {/* Reset Token Input */}
            <View className="mb-4">
              <FormInput
                control={control}
                name="resetToken"
                label="Mã xác nhận"
                placeholder="Nhập mã từ email"
                leftIcon={
                  <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} />
                }
              />
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <FormInput
                control={control}
                name="password"
                label="Mật khẩu mới"
                placeholder="********"
                secureTextEntry
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                }
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <FormInput
                control={control}
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                placeholder="********"
                secureTextEntry
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                }
              />
            </View>

            {/* Submit Button */}
            <Button
              variant="gradient"
              onPress={handleSubmit(onSubmit)}
              loading={resetPasswordMutation.isPending}
              fullWidth
            >
              Đặt lại mật khẩu
            </Button>

            {/* Back to Login */}
            <View className="mt-3">
              <Button
                variant="secondary"
                onPress={() => router.replace("/(auth)/login" as never)}
                fullWidth
              >
                Quay lại đăng nhập
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
