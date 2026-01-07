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

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  // Debug: Log form errors
  console.log("[Login] Form errors:", errors);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; password: string }) => {
      console.log("[Login] mutationFn executing with:", data);
      const result = await authApi.login(data);
      console.log("[Login] API response:", result);
      return result;
    },
    onSuccess: async (data) => {
      console.log("[Login] onSuccess - setting auth...");
      // First set auth with token so API calls are authenticated
      const tempUser = {
        id: 0,
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
        email: null,
        role: data.role,
        addressId: null,
        branchId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setAuth(tempUser, data.accessToken);

      // Fetch complete user profile to get actual ID
      try {
        console.log("[Login] Fetching user profile...");
        const profileResponse = await authApi.getCurrentUser();
        console.log("[Login] User profile response:", profileResponse);
        // Map userId to id (API returns userId, frontend expects id)
        const fullUser = {
          ...tempUser,
          id: (profileResponse as { userId?: number }).userId || profileResponse.id || 0,
          fullName: profileResponse.fullName || tempUser.fullName,
          phoneNumber: profileResponse.phoneNumber || tempUser.phoneNumber,
          role: profileResponse.role || tempUser.role,
          email: profileResponse.email ?? tempUser.email,
        };
        console.log("[Login] Mapped user:", fullUser);
        await setAuth(fullUser, data.accessToken);
      } catch (error) {
        console.error("[Login] Failed to fetch user profile:", error);
        // Continue with temp user - booking will fail but login works
      }

      showToast(t("auth.loginSuccess"), "success");
      router.replace("/(tabs)");
    },
    onError: (error: Error) => {
      console.log("[Login] onError:", error);
      showToast(error.message || t("common.error"), "error");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("[Login] onSubmit called with:", data);
    console.log("[Login] Calling loginMutation.mutate...");
    loginMutation.mutate({
      phoneNumber: data.phoneNumber,
      password: data.password,
    });
  };

  const handleLoginPress = () => {
    console.log("[Login] Button pressed!");
    handleSubmit(onSubmit)();
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
            <Pressable
              className="self-end mb-8"
              onPress={() => router.push("/(auth)/forgot-password" as never)}
            >
              <Text className="text-primary text-sm font-montserrat-medium">
                {t("auth.forgotPassword")}
              </Text>
            </Pressable>

            {/* Login Button */}
            <Button
              variant="gradient"
              onPress={handleLoginPress}
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
