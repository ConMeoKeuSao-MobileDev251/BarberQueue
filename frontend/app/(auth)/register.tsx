/**
 * Register Screen
 * New user registration with form validation
 */
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { authApi } from "@/src/api/auth";
import { Button } from "@/src/components/ui/button";
import { FormInput } from "@/src/components/form/form-input";
import { FormPhoneInput } from "@/src/components/form/form-phone-input";
import { showToast } from "@/src/components/ui/toast";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { colors } from "@/src/constants/theme";

// Validation schema
const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.registerClient,
    onSuccess: async () => {
      showToast(t("auth.registerSuccess"), "success");
      router.replace("/(auth)/login" as never);
    },
    onError: (error: Error) => {
      showToast(error.message || t("common.error"), "error");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email || undefined,
      password: data.password,
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title={t("auth.register")} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome text */}
          <View className="mb-8">
            <Text className="text-text-primary text-2xl font-montserrat-bold mb-2">
              Tạo tài khoản mới
            </Text>
            <Text className="text-text-secondary text-md font-montserrat-regular">
              Điền thông tin để đăng ký tài khoản
            </Text>
          </View>

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

          {/* Phone Input */}
          <View className="mb-4">
            <FormPhoneInput
              control={control}
              name="phoneNumber"
              label={t("auth.phoneNumber")}
              placeholder="912 345 678"
            />
          </View>

          {/* Email (optional) */}
          <View className="mb-4">
            <FormInput
              control={control}
              name="email"
              label={`${t("auth.email")} (tuỳ chọn)`}
              placeholder="email@example.com"
              keyboardType="email-address"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              }
            />
          </View>

          {/* Password */}
          <View className="mb-4">
            <FormInput
              control={control}
              name="password"
              label={t("auth.password")}
              placeholder="********"
              secureTextEntry
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              }
            />
          </View>

          {/* Confirm Password */}
          <View className="mb-8">
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

          {/* Register Button */}
          <Button
            variant="gradient"
            onPress={handleSubmit(onSubmit)}
            loading={registerMutation.isPending}
            fullWidth
          >
            {t("auth.register")}
          </Button>

          {/* Login Link */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-text-secondary text-sm font-montserrat-regular">
              {t("auth.haveAccount")}{" "}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/login" as never)}>
              <Text className="text-primary text-sm font-montserrat-semibold">
                {t("auth.login")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
