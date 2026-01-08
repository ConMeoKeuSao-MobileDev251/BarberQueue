/**
 * Service Management Screen
 * List and manage barber services
 */
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { servicesApi } from "@/src/api/services";
import { colors } from "@/src/constants/theme";
import { getServiceIcon } from "@/src/constants/service-icons";
import type { Service } from "@/src/types";

// Format price in VND
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  const iconSource = getServiceIcon(service.name);

  return (
    <View className="bg-white rounded-xl p-4 mb-3">
      <View className="flex-row items-center">
        {/* Icon */}
        <View className="w-12 h-12 rounded-xl bg-orange-50 items-center justify-center">
          {typeof iconSource === "number" ? (
            <View className="w-8 h-8">
              <Ionicons name="cut" size={24} color={colors.primary} />
            </View>
          ) : (
            <Ionicons name="cut" size={24} color={colors.primary} />
          )}
        </View>

        {/* Info */}
        <View className="flex-1 ml-3">
          <Text className="text-text-primary font-montserrat-semibold">{service.name}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-primary font-montserrat-bold">{formatPrice(service.price)}</Text>
            <View className="w-1 h-1 rounded-full bg-text-tertiary mx-2" />
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text className="text-text-secondary text-sm font-montserrat-regular ml-1">
                {service.duration} phút
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ServiceManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch services
  const { data: services = [], refetch, isLoading } = useQuery({
    queryKey: ["owner", "services"],
    queryFn: servicesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <View className="flex-1 bg-background-secondary">
      {/* Header */}
      <View className="bg-white px-4 pb-4" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-montserrat-bold text-text-primary">Dịch vụ</Text>
        <Text className="text-sm font-montserrat-regular text-text-secondary mt-1">
          Quản lý danh sách dịch vụ
        </Text>
      </View>

      {/* Service List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <View className="items-center py-8">
            <Text className="text-text-secondary font-montserrat-regular">Đang tải...</Text>
          </View>
        ) : services.length === 0 ? (
          <View className="bg-white rounded-xl p-6 items-center">
            <Ionicons name="cut-outline" size={48} color={colors.textTertiary} />
            <Text className="text-text-secondary font-montserrat-regular mt-2">
              Chưa có dịch vụ nào
            </Text>
            <Pressable
              onPress={() => router.push("/owner/service/create" as never)}
              className="mt-3 bg-primary px-4 py-2 rounded-full"
            >
              <Text className="text-white font-montserrat-medium">Thêm dịch vụ</Text>
            </Pressable>
          </View>
        ) : (
          services.map((service) => <ServiceCard key={service.id} service={service} />)
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/owner/service/create" as never)}
        className="absolute right-4 bottom-24 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        style={{ elevation: 8 }}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </View>
  );
}
