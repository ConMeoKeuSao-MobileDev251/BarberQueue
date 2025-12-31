/**
 * Account Screen
 * User profile and settings
 */
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "@/src/stores";
import { Avatar } from "@/src/components/ui/avatar";
import { ConfirmDialog } from "@/src/components/layout/modal";
import { colors } from "@/src/constants/theme";

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: () => void;
  destructive?: boolean;
}

export default function AccountScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLogoutModalVisible(false);
    router.replace("/(auth)/login" as never);
  };

  const menuItems: MenuItem[] = [
    {
      id: "history",
      label: t("account.history"),
      icon: "heart-outline",
      route: "/(tabs)/bookings",
    },
    {
      id: "payment",
      label: t("account.payment"),
      icon: "card-outline",
      route: "/account/payment",
    },
    {
      id: "addresses",
      label: t("account.addresses"),
      icon: "business-outline",
      route: "/account/addresses",
    },
    {
      id: "notifications",
      label: t("account.notifications"),
      icon: "notifications-outline",
      route: "/account/notifications",
    },
    {
      id: "partner",
      label: t("account.becomePartner"),
      icon: "storefront-outline",
      route: "/account/partner",
    },
    {
      id: "logout",
      label: t("auth.logout"),
      icon: "log-out-outline",
      action: () => setLogoutModalVisible(true),
      destructive: true,
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      router.push(item.route as never);
    }
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View
          className="bg-white px-4 pb-6"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="flex-row items-center">
            {/* Avatar */}
            <Avatar
              source={null}
              name={user?.fullName || "User"}
              size="xl"
            />

            {/* User Info */}
            <View className="flex-1 ml-4">
              <Text className="text-text-primary text-xl font-montserrat-bold">
                {user?.fullName || "Guest"}
              </Text>
              <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                {user?.phoneNumber || "Chưa đăng nhập"}
              </Text>
              {user?.email && (
                <Text className="text-text-secondary text-sm font-montserrat-regular">
                  {user.email}
                </Text>
              )}
            </View>

            {/* Edit Button */}
            <Pressable
              onPress={() => router.push("/account/edit" as never)}
              className="flex-row items-center"
            >
              <Text className="text-primary text-sm font-montserrat-medium">
                {t("account.editProfile")}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mt-4 bg-white">
          {menuItems.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => handleMenuPress(item)}
              className={`flex-row items-center px-4 py-4 ${
                index < menuItems.length - 1 ? "border-b border-border-light" : ""
              }`}
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.backgroundSecondary : "white",
              })}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={item.destructive ? colors.coral : colors.textPrimary}
              />
              <Text
                className={`flex-1 ml-4 text-md font-montserrat-medium ${
                  item.destructive ? "text-coral" : "text-text-primary"
                }`}
              >
                {item.label}
              </Text>
              {!item.destructive && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textTertiary}
                />
              )}
            </Pressable>
          ))}
        </View>

        {/* App Version */}
        <View className="items-center py-8">
          <Text className="text-text-tertiary text-xs font-montserrat-regular">
            BarberQueue v1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmDialog
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={handleLogout}
        title={t("auth.logout")}
        message={t("auth.logoutConfirm")}
        confirmLabel={t("auth.logout")}
        cancelLabel={t("common.cancel")}
        destructive
      />
    </View>
  );
}
