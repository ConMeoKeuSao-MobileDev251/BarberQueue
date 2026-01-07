/**
 * Home Screen
 * Main landing screen with shop discovery
 */
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Image } from "expo-image";

import { branchesApi } from "@/src/api/branches";
import { useAuthStore } from "@/src/stores";
import type { Branch } from "@/src/types";
import { useLocation } from "@/src/hooks";
import { Avatar } from "@/src/components/ui/avatar";
import { BarberQueueLogo } from "@/src/components/ui/barberqueue-logo";
import { SearchInput } from "@/src/components/ui/search-input";
import { ShopCard } from "@/src/components/shared/shop-card";
import { FilterChips } from "@/src/components/shared/filter-chips";
import { SkeletonShopCard } from "@/src/components/ui/skeleton";
import { EmptySearchResults } from "@/src/components/ui/empty-state";
import { colors } from "@/src/constants/theme";

// Local assets
const couponImage = require("../../assets/images/coupon-image.png");

// Filter options
const filterOptions = [
  { id: "price", label: "Giá", icon: "cash-outline" as const },
  { id: "promo", label: "Khuyến mãi", icon: "pricetag-outline" as const },
  { id: "rating", label: "Đánh giá", icon: "star-outline" as const },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);

  const [selectedFilter, setSelectedFilter] = useState<string | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  // Get user's current location
  const {
    coords,
    locationName,
    isLoading: locationLoading,
    refresh: refreshLocation,
  } = useLocation();

  // Fetch nearby branches - starts with default location, auto-refetches when real location arrives
  const {
    data: branches,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["branches", coords.latitude, coords.longitude],
    queryFn: () =>
      branchesApi.searchByLocation(coords.latitude, coords.longitude),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshLocation();
    await refetch();
    setRefreshing(false);
  }, [refetch, refreshLocation]);

  const handleSearchPress = () => {
    router.push("/(tabs)/search" as never);
  };

  const handleShopPress = (branch: Branch) => {
    router.push({
      pathname: `/shop/${branch.id}`,
      params: { branchData: JSON.stringify(branch) },
    } as never);
  };

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications
  };

  return (
    <View className="flex-1 bg-background-secondary">
      {/* Header */}
      <View
        className="bg-white px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          {/* User Avatar */}
          <Avatar
            source={null}
            name={user?.fullName || "User"}
            size="md"
          />

          {/* Logo */}
          <BarberQueueLogo size="md" />

          {/* Notification Bell */}
          <Pressable
            onPress={handleNotificationPress}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Greeting */}
        <Text className="text-text-secondary text-sm font-montserrat-regular">
          {t("home.greeting")},
        </Text>
        <Text className="text-text-primary text-xl font-montserrat-bold">
          {user?.fullName || "Guest"}
        </Text>

        {/* Location Selector */}
        <Pressable
          className="flex-row items-center mt-2"
          onPress={refreshLocation}
        >
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text className="text-primary text-sm font-montserrat-medium ml-1">
            {locationLoading ? "Đang xác định..." : locationName || "TP. Hồ Chí Minh"}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <View className="px-4 mt-4">
          <Pressable onPress={handleSearchPress}>
            <View pointerEvents="none">
              <SearchInput
                value=""
                onChangeText={() => {}}
                placeholder={t("home.searchPlaceholder")}
              />
            </View>
          </Pressable>
        </View>

        {/* Filter Chips */}
        <View className="mt-4">
          <FilterChips
            options={filterOptions}
            selected={selectedFilter}
            onChange={(id) =>
              setSelectedFilter(id === selectedFilter ? undefined : id)
            }
          />
        </View>

        {/* Promotions Section */}
        <View className="mt-6 px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-primary text-lg font-montserrat-semibold">
              {t("home.promotions")}
            </Text>
            <Pressable className="flex-row items-center">
              <Text className="text-primary text-sm font-montserrat-medium">
                {t("common.seeAll")}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </Pressable>
          </View>

          {/* Promo Card */}
          <View className="rounded-xl h-32 overflow-hidden relative">
            <Image
              source={couponImage}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
            {/* Overlay gradient for text readability */}
            <View className="absolute inset-0 bg-black/30" />
            <View className="absolute bottom-0 left-0 right-0 p-4">
              <Text className="text-white text-lg font-montserrat-bold">
                Giảm 20% lần đầu
              </Text>
              <Text className="text-white/80 text-sm font-montserrat-regular mt-1">
                Áp dụng cho tất cả dịch vụ
              </Text>
            </View>
          </View>
        </View>

        {/* Nearby Shops Section */}
        <View className="mt-6 px-4 pb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-primary text-lg font-montserrat-semibold">
              {t("home.nearYou")}
            </Text>
            <Pressable className="flex-row items-center">
              <Text className="text-primary text-sm font-montserrat-medium">
                {t("common.seeAll")}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </Pressable>
          </View>

          {/* Shop List */}
          {isLoading ? (
            <View className="gap-4">
              <SkeletonShopCard />
              <SkeletonShopCard />
            </View>
          ) : branches && branches.length > 0 ? (
            <View className="gap-4">
              {branches.map((branch) => (
                <ShopCard
                  key={branch.id}
                  id={branch.id.toString()}
                  name={branch.name}
                  address={branch.address?.addressText || ""}
                  image={null}
                  isOpen={true}
                  onPress={() => handleShopPress(branch)}
                />
              ))}
            </View>
          ) : (
            <EmptySearchResults onAction={onRefresh} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
