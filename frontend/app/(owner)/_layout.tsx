/**
 * Owner Tab Layout
 * Navigation for owner management screens
 */
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";
import { useAuthStore } from "@/src/stores";

export default function OwnerTabLayout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Role guard - redirect non-owners
  useEffect(() => {
    console.log("[Owner Layout] Role guard check:", {
      isAuthenticated,
      userRole: user?.role,
    });
    if (!isAuthenticated) {
      console.log("[Owner Layout] Not authenticated, redirecting to login");
      router.replace("/(auth)/login");
      return;
    }
    if (user?.role !== "owner") {
      console.log("[Owner Layout] Not owner, redirecting to tabs");
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, user?.role, router]);

  console.log("[Owner Layout] Rendering tabs");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.borderLight,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontFamily: "Montserrat-Medium",
          fontSize: 10,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tổng quan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="staff"
        options={{
          title: "Nhân viên",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="branches"
        options={{
          title: "Chi nhánh",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addresses"
        options={{
          title: "Địa chỉ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Dịch vụ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cut" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
