/**
 * Login Screen
 * Phone number and password authentication
 */
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { authApi } from "@/src/api/auth";
import { useAuthStore } from "@/src/stores";
import { Button } from "@/src/components/ui/button";
import { FormInput } from "@/src/components/form/form-input";
import { FormPhoneInput } from "@/src/components/form/form-phone-input";
import { showToast } from "@/src/components/ui/toast";
import { colors, gradients } from "@/src/constants/theme";

// Validation schema
const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(10, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      await setAuth(data.user, data.access_token);
      showToast(t("auth.loginSuccess"), "success");
      router.replace("/(tabs)");
    },
    onError: (error: Error) => {
      showToast(error.message || t("common.error"), "error");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      phoneNumber: data.phoneNumber,
      password: data.password,
    });
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with gradient */}
          <LinearGradient
            colors={[...gradients.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 pb-12 rounded-b-3xl"
            style={{ paddingTop: insets.top + 20 }}
          >
            <View className="items-center">
              {/* Logo */}
              <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-4">
                <Ionicons name="cut" size={40} color="white" />
              </View>
              <Text className="text-white text-3xl font-montserrat-bold">
                BarberQueue
              </Text>
              <Text className="text-white/80 text-md font-montserrat-regular mt-2">
                {t("auth.login")}
              </Text>
            </View>
          </LinearGradient>

          {/* Form */}
          <View className="flex-1 px-6 pt-8">
            {/* Phone Input */}
            <View className="mb-4">
              <FormPhoneInput
                control={control}
                name="phoneNumber"
                label={t("auth.phoneNumber")}
                placeholder="912 345 678"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
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

            {/* Forgot Password */}
            <Pressable className="self-end mb-8">
              <Text className="text-primary text-sm font-montserrat-medium">
                {t("auth.forgotPassword")}
              </Text>
            </Pressable>

            {/* Login Button */}
            <Button
              variant="gradient"
              onPress={handleSubmit(onSubmit)}
              loading={loginMutation.isPending}
              fullWidth
            >
              {t("auth.login")}
            </Button>

            {/* Register Link */}
            <View className="flex-row items-center justify-center mt-6">
              <Text className="text-text-secondary text-sm font-montserrat-regular">
                {t("auth.noAccount")}{" "}
              </Text>
              <Pressable onPress={() => router.push("/(auth)/register" as never)}>
                <Text className="text-primary text-sm font-montserrat-semibold">
                  {t("auth.register")}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
