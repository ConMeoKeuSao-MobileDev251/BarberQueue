/**
 * Auth Tab Toggle Component
 * Pill-shaped tab toggle for login/register switching with smooth animations
 */
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { colors } from "@/src/constants/theme";

type AuthTab = "login" | "register";

interface AuthTabToggleProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ANIMATION_DURATION = 300;

export function AuthTabToggle({ activeTab, onTabChange }: AuthTabToggleProps) {
  const { t } = useTranslation();

  // Shared values for animations (0 = login, 1 = register)
  const loginProgress = useSharedValue(activeTab === "login" ? 1 : 0);
  const registerProgress = useSharedValue(activeTab === "register" ? 1 : 0);

  useEffect(() => {
    const timingConfig = {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    };

    if (activeTab === "login") {
      loginProgress.value = withTiming(1, timingConfig);
      registerProgress.value = withTiming(0, timingConfig);
    } else {
      loginProgress.value = withTiming(0, timingConfig);
      registerProgress.value = withTiming(1, timingConfig);
    }
  }, [activeTab, loginProgress, registerProgress]);

  // Animated styles for login tab
  const loginTabStyle = useAnimatedStyle(() => ({
    backgroundColor:
      loginProgress.value === 1
        ? colors.primary
        : `rgba(255, 107, 53, ${loginProgress.value})`,
  }));

  const loginTextStyle = useAnimatedStyle(() => ({
    color:
      loginProgress.value > 0.5 ? colors.textInverse : colors.textSecondary,
  }));

  // Animated styles for register tab
  const registerTabStyle = useAnimatedStyle(() => ({
    backgroundColor:
      registerProgress.value === 1
        ? colors.primary
        : `rgba(255, 107, 53, ${registerProgress.value})`,
  }));

  const registerTextStyle = useAnimatedStyle(() => ({
    color:
      registerProgress.value > 0.5 ? colors.textInverse : colors.textSecondary,
  }));

  return (
    <View className="flex-row bg-gray-100 rounded-full p-1">
      {/* Login Tab */}
      <AnimatedPressable
        onPress={() => onTabChange("login")}
        className="flex-1 py-3 px-2 rounded-full items-center justify-center"
        style={loginTabStyle}
        accessibilityRole="tab"
        accessibilityLabel={t("auth.login")}
        accessibilityState={{ selected: activeTab === "login" }}
        accessibilityHint="Double tap to switch to login form"
      >
        <Animated.Text
          className="font-montserrat-medium text-sm"
          style={[{ fontFamily: "Montserrat-Medium" }, loginTextStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {t("auth.login")}
        </Animated.Text>
      </AnimatedPressable>

      {/* Register Tab */}
      <AnimatedPressable
        onPress={() => onTabChange("register")}
        className="flex-1 py-3 px-2 rounded-full items-center justify-center"
        style={registerTabStyle}
        accessibilityRole="tab"
        accessibilityLabel={t("auth.register")}
        accessibilityState={{ selected: activeTab === "register" }}
        accessibilityHint="Double tap to switch to registration form"
      >
        <Animated.Text
          className="font-montserrat-medium text-sm"
          style={[{ fontFamily: "Montserrat-Medium" }, registerTextStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {t("auth.register")}
        </Animated.Text>
      </AnimatedPressable>
    </View>
  );
}
