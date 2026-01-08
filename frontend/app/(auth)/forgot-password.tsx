/**
 * Forgot Password Screen
 * Request password reset via email
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
const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      showToast("Đã gửi email đặt lại mật khẩu", "success");
      router.push("/(auth)/reset-password" as never);
    },
    onError: (error: Error) => {
      showToast(error.message || "Không thể gửi email", "error");
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate({ email: data.email });
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title={t("auth.forgotPassword")} />

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
                <Ionicons name="mail-outline" size={40} color={colors.primary} />
              </View>
              <Text className="text-text-primary text-xl font-montserrat-bold text-center">
                Quên mật khẩu?
              </Text>
              <Text className="text-text-secondary text-sm font-montserrat-regular text-center mt-2 px-4">
                Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu
              </Text>
            </View>

            {/* Email Input */}
            <View className="mb-6">
              <FormInput
                control={control}
                name="email"
                label="Email"
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={
                  <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                }
              />
            </View>

            {/* Submit Button */}
            <Button
              variant="gradient"
              onPress={handleSubmit(onSubmit)}
              loading={forgotPasswordMutation.isPending}
              fullWidth
            >
              Gửi email
            </Button>

            {/* Back to Login */}
            <View className="mt-3">
              <Button
                variant="secondary"
                onPress={() => router.back()}
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
