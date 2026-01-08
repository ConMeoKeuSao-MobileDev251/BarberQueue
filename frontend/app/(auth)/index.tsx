/**
 * Unified Auth Screen
 * Single screen with tab-based login/register switching
 */
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { authApi } from "@/src/api/auth";
import { useAuthStore } from "@/src/stores";
import { Button } from "@/src/components/ui/button";
import { FormInput } from "@/src/components/form/form-input";
import { FormPhoneInput } from "@/src/components/form/form-phone-input";
import { FormDateInput } from "@/src/components/form/form-date-input";
import { AuthTabToggle } from "@/src/components/auth";
import { showToast } from "@/src/components/ui/toast";
import { colors } from "@/src/constants/theme";

// Logo asset
const logoIcon = require("@/assets/barberqueue_logo_notext.png");

// Validation schemas
const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(10, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
    phoneNumber: z
      .string()
      .min(9, "Số điện thoại không hợp lệ")
      .max(10, "Số điện thoại không hợp lệ"),
    email: z.string(),
    dateOfBirth: z.string().optional(),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type AuthTab = "login" | "register";

export default function AuthScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [rememberMe, setRememberMe] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { phoneNumber: "", password: "" },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; password: string }) => {
      const result = await authApi.login(data);
      return result;
    },
    onSuccess: async (data) => {
      // Set auth with token
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

      // Fetch complete user profile
      try {
        const profileResponse = await authApi.getCurrentUser();
        const fullUser = {
          ...tempUser,
          id:
            (profileResponse as { userId?: number }).userId ||
            profileResponse.id ||
            0,
          fullName: profileResponse.fullName || tempUser.fullName,
          phoneNumber: profileResponse.phoneNumber || tempUser.phoneNumber,
          role: profileResponse.role || tempUser.role,
          email: profileResponse.email ?? tempUser.email,
        };
        await setAuth(fullUser, data.accessToken);
      } catch (error) {
        console.error("[Auth] Failed to fetch user profile:", error);
      }

      showToast(t("auth.loginSuccess"), "success");
      router.replace("/(tabs)");
    },
    onError: (error: Error) => {
      showToast(error.message || t("common.error"), "error");
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.registerClient,
    onSuccess: async (response) => {
      console.log("[Register] Success:", response);
      showToast(t("auth.registerSuccess"), "success");
      setActiveTab("login");
      registerForm.reset();
    },
    onError: (error: unknown) => {
      console.error("[Register] Error:", error);
      // Log axios error response for debugging
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: unknown; status?: number };
        };
        console.error("[Register] Response data:", axiosError.response?.data);
        console.error(
          "[Register] Response status:",
          axiosError.response?.status
        );
      }
      const message =
        error instanceof Error ? error.message : t("common.error");
      showToast(message, "error");
    },
  });

  const handleLogin = loginForm.handleSubmit((data) => {
    loginMutation.mutate({
      phoneNumber: data.phoneNumber,
      password: data.password,
    });
  });

  const handleRegister = registerForm.handleSubmit((data) => {
    const payload = {
      phoneNumber: data.phoneNumber,
      password: data.password,
      fullName: data.fullName,
      birthDate: data.dateOfBirth || undefined,
      email: data.email || "",
      role: "client" as const,
      // Required by API - using default HCM coordinates for now
      addressText: "Ho Chi Minh City, Vietnam",
      latitude: 10.8231,
      longitude: 106.6297,
    };
    console.log("[Register] Form data:", data);
    console.log("[Register] API payload:", payload);
    registerMutation.mutate(payload);
  });

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top + 12}
        className="flex-1"
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 24,
          }}
          enableOnAndroid
          extraScrollHeight={16}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="items-center pt-8 px-6">
            <Image
              source={logoIcon}
              style={{ width: 80, height: 80 }}
              contentFit="contain"
            />

            <Text className="text-2xl font-montserrat-bold text-text-primary mt-4">
              BarberQueue
            </Text>

            <Text className="text-xl font-montserrat-semibold text-text-primary mt-2">
              {activeTab === "login"
                ? t("auth.welcomeBack")
                : t("auth.createAccount")}
            </Text>

            <Text className="text-md font-montserrat-regular text-text-secondary mt-1">
              {t("auth.bookInSeconds")}
            </Text>
          </View>

          {/* Tab Toggle */}
          <View className="px-6 mt-6">
            <AuthTabToggle activeTab={activeTab} onTabChange={setActiveTab} />
          </View>

          {/* Form Content */}
          <View className="px-6 mt-6 flex-1">
            {activeTab === "login" ? (
              // Login Form
              <View>
                <View className="mb-4">
                  <FormPhoneInput
                    control={loginForm.control}
                    name="phoneNumber"
                    label={t("auth.phoneNumber")}
                    placeholder="912 345 678"
                  />
                </View>

                <View className="mb-4">
                  <FormInput
                    control={loginForm.control}
                    name="password"
                    label={t("auth.password")}
                    placeholder="********"
                    secureTextEntry
                    leftIcon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.textTertiary}
                      />
                    }
                  />
                </View>

                {/* Remember me & Forgot password row */}
                <View className="flex-row items-center justify-between mb-6">
                  <Pressable
                    className="flex-row items-center"
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View
                      className={`w-5 h-5 rounded border items-center justify-center ${
                        rememberMe
                          ? "bg-primary border-primary"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {rememberMe && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <Text className="text-text-secondary text-sm font-montserrat-regular ml-2">
                      Ghi nhớ tôi
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push("/(auth)/forgot-password" as never)
                    }
                  >
                    <Text className="text-primary text-sm font-montserrat-medium">
                      {t("auth.forgotPassword")}
                    </Text>
                  </Pressable>
                </View>

                <Button
                  variant="primary"
                  onPress={handleLogin}
                  loading={loginMutation.isPending}
                  fullWidth
                  size="lg"
                >
                  {t("auth.login")}
                </Button>
              </View>
            ) : (
              // Register Form
              <View>
                {/* Full Name */}
                <View className="mb-4">
                  <FormInput
                    control={registerForm.control}
                    name="fullName"
                    label="Họ và tên"
                    placeholder="Nguyễn Văn A"
                    autoCapitalize="words"
                  />
                </View>

                <View className="mb-4">
                  <FormPhoneInput
                    control={registerForm.control}
                    name="phoneNumber"
                    label={t("auth.phoneNumber")}
                    placeholder="912 345 678"
                  />
                </View>

                <View className="mb-4">
                  <FormInput
                    control={registerForm.control}
                    name="email"
                    label={t("auth.email")}
                    placeholder="email@example.com"
                  />
                </View>

                <View className="mb-4">
                  <FormDateInput
                    control={registerForm.control}
                    name="dateOfBirth"
                    label="Ngày sinh"
                    placeholder="DD/MM/YYYY"
                    maximumDate={new Date()}
                  />
                </View>

                <View className="mb-4">
                  <FormInput
                    control={registerForm.control}
                    name="password"
                    label={t("auth.password")}
                    placeholder="********"
                    secureTextEntry
                    leftIcon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.textTertiary}
                      />
                    }
                  />
                </View>

                <View className="mb-6">
                  <FormInput
                    control={registerForm.control}
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    placeholder="********"
                    secureTextEntry
                    leftIcon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.textTertiary}
                      />
                    }
                  />
                </View>

                <Button
                  variant="primary"
                  onPress={handleRegister}
                  loading={registerMutation.isPending}
                  fullWidth
                  size="lg"
                >
                  {t("auth.register")}
                </Button>
              </View>
            )}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: insets.bottom + 24 }} />
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
