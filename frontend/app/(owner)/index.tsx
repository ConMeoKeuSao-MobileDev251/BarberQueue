/**
 * Owner Dashboard Screen
 * Overview with stats and quick navigation
 */
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { branchesApi } from "@/src/api/branches";
import { servicesApi } from "@/src/api/services";
import { useAuthStore } from "@/src/stores";
import { colors } from "@/src/constants/theme";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number | string;
  color?: string;
}

function StatCard({ icon, label, value, color = colors.primary }: StatCardProps) {
  return (
    <View className="flex-1 bg-white rounded-xl p-4 mx-1 items-center">
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text className="text-2xl font-montserrat-bold text-text-primary">{value}</Text>
      <Text className="text-xs font-montserrat-medium text-text-secondary mt-1">{label}</Text>
    </View>
  );
}

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

function QuickAction({ icon, label, onPress, color = colors.primary }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 bg-white rounded-xl p-4 mx-1 items-center active:opacity-70"
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-xs font-montserrat-medium text-text-primary text-center">{label}</Text>
    </Pressable>
  );
}

export default function OwnerDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch branches
  const { data: branches = [], refetch: refetchBranches } = useQuery({
    queryKey: ["owner", "branches"],
    queryFn: branchesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch services
  const { data: services = [], refetch: refetchServices } = useQuery({
    queryKey: ["owner", "services"],
    queryFn: servicesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch staff count (sum across all branches)
  const { data: staffCount = 0, refetch: refetchStaff } = useQuery({
    queryKey: ["owner", "staff-count"],
    queryFn: async () => {
      let total = 0;
      for (const branch of branches) {
        try {
          const staff = await branchesApi.getStaffByBranch(branch.id);
          total += staff.length;
        } catch {
          // Skip if branch has no staff
        }
      }
      return total;
    },
    enabled: branches.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchBranches(), refetchServices(), refetchStaff()]);
    setRefreshing(false);
  }, [refetchBranches, refetchServices, refetchStaff]);

  return (
    <View className="flex-1 bg-background-secondary">
      {/* Header */}
      <View
        className="bg-primary px-4 pb-6"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white/80 text-sm font-montserrat-regular">Xin chào,</Text>
            <Text className="text-white text-xl font-montserrat-bold">
              {user?.fullName || "Chủ cửa hàng"}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              logout();
              router.replace("/(auth)/login");
            }}
            className="flex-row items-center bg-white/20 px-3 py-2 rounded-full"
          >
            <Ionicons name="log-out-outline" size={18} color="white" />
            <Text className="text-white text-sm font-montserrat-medium ml-1">Đăng xuất</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View className="flex-row px-3 mt-4">
          <StatCard icon="people" label="Nhân viên" value={staffCount} color="#4CAF50" />
          <StatCard icon="business" label="Chi nhánh" value={branches.length} color="#2196F3" />
          <StatCard icon="cut" label="Dịch vụ" value={services.length} color="#FF9800" />
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-6">
          <Text className="text-lg font-montserrat-semibold text-text-primary mb-3">
            Quản lý nhanh
          </Text>
          <View className="flex-row">
            <QuickAction
              icon="person-add"
              label="Thêm nhân viên"
              onPress={() => router.push("/owner/staff/create" as never)}
              color="#4CAF50"
            />
            <QuickAction
              icon="add-circle"
              label="Thêm chi nhánh"
              onPress={() => router.push("/owner/branch/create" as never)}
              color="#2196F3"
            />
            <QuickAction
              icon="cut"
              label="Thêm dịch vụ"
              onPress={() => router.push("/owner/service/create" as never)}
              color="#FF9800"
            />
            <QuickAction
              icon="location"
              label="Thêm địa chỉ"
              onPress={() => router.push("/owner/address/create" as never)}
              color="#9C27B0"
            />
          </View>
        </View>

        {/* Recent Branches */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-montserrat-semibold text-text-primary">
              Chi nhánh gần đây
            </Text>
            <Pressable onPress={() => router.push("/(owner)/branches" as never)}>
              <Text className="text-sm font-montserrat-medium text-primary">Xem tất cả</Text>
            </Pressable>
          </View>

          {branches.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <Ionicons name="business-outline" size={48} color={colors.textTertiary} />
              <Text className="text-text-secondary font-montserrat-regular mt-2">
                Chưa có chi nhánh nào
              </Text>
              <Pressable
                onPress={() => router.push("/owner/branch/create" as never)}
                className="mt-3 bg-primary px-4 py-2 rounded-full"
              >
                <Text className="text-white font-montserrat-medium">Thêm chi nhánh</Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-2">
              {branches.slice(0, 3).map((branch) => (
                <Pressable
                  key={branch.id}
                  onPress={() => router.push(`/owner/branch/${branch.id}` as never)}
                  className="bg-white rounded-xl p-4 flex-row items-center active:opacity-70"
                >
                  <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                    <Ionicons name="business" size={20} color="#2196F3" />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-text-primary font-montserrat-semibold">{branch.name}</Text>
                    <Text className="text-text-secondary text-xs font-montserrat-regular" numberOfLines={1}>
                      {branch.address?.addressText || "Chưa có địa chỉ"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
