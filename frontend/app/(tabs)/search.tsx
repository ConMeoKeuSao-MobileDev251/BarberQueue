/**
 * Search Screen
 * Search for barbershops by name with local storage for recent searches
 */
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

import { SearchInput } from "@/src/components/ui/search-input";
import { ShopCard } from "@/src/components/shared/shop-card";
import { colors } from "@/src/constants/theme";
import { useLocation } from "@/src/hooks";
import { branchesApi } from "@/src/api/branches";

const RECENT_SEARCHES_KEY = "@barberqueue:recent_searches";
const MAX_RECENT_SEARCHES = 10;

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    coords,
    locationName,
    isLoading: locationLoading,
    refresh: refreshLocation,
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Fetch branches by user's location
  const { data: branches = [], isLoading: branchesLoading } = useQuery({
    queryKey: ["branches", "search", coords.latitude, coords.longitude],
    queryFn: () => branchesApi.searchByLocation(coords.latitude, coords.longitude),
    enabled: !locationLoading,
  });

  // Filter branches by search query (client-side, case-insensitive)
  const filteredBranches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return branches;
    return branches.filter((b) => b.name.toLowerCase().includes(query));
  }, [branches, searchQuery]);

  // Load recent searches from AsyncStorage
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load recent searches:", error);
      }
    };
    loadRecentSearches();
  }, []);

  // Save recent search to AsyncStorage
  const saveRecentSearch = useCallback(
    async (query: string) => {
      try {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        const updatedSearches = [
          trimmedQuery,
          ...recentSearches.filter((s) => s !== trimmedQuery),
        ].slice(0, MAX_RECENT_SEARCHES);

        setRecentSearches(updatedSearches);
        await AsyncStorage.setItem(
          RECENT_SEARCHES_KEY,
          JSON.stringify(updatedSearches)
        );
      } catch (error) {
        console.error("Failed to save recent search:", error);
      }
    },
    [recentSearches]
  );

  const handleClearRecent = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error("Failed to clear recent searches:", error);
    }
  }, []);

  const handleRemoveRecentSearch = useCallback(
    async (query: string) => {
      try {
        const updatedSearches = recentSearches.filter((s) => s !== query);
        setRecentSearches(updatedSearches);
        await AsyncStorage.setItem(
          RECENT_SEARCHES_KEY,
          JSON.stringify(updatedSearches)
        );
      } catch (error) {
        console.error("Failed to remove recent search:", error);
      }
    },
    [recentSearches]
  );

  const handleRecentSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleBranchPress = useCallback(
    (branch: (typeof branches)[0]) => {
      // Save search query if user searched before tapping
      if (searchQuery.trim()) {
        saveRecentSearch(searchQuery);
      }
      router.push({
        pathname: "/shop/[id]",
        params: { id: branch.id, branchData: JSON.stringify(branch) },
      });
    },
    [router, searchQuery, saveRecentSearch]
  );

  return (
    <View className="flex-1 bg-background-secondary">
      {/* Header */}
      <View
        className="bg-white px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        {/* Location */}
        <View className="flex-row items-center mb-4">
          <Pressable
            className="flex-row items-center flex-1"
            onPress={refreshLocation}
          >
            <Ionicons name="location" size={18} color={colors.primary} />
            <Text className="text-text-primary text-sm font-montserrat-medium ml-2">
              {locationLoading
                ? "Đang xác định..."
                : locationName || "TP. Hồ Chí Minh"}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("home.searchPlaceholder")}
          onClear={() => setSearchQuery("")}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Recent Searches - only show when no search query */}
        {!searchQuery.trim() && recentSearches.length > 0 && (
          <View className="px-4 mt-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-text-primary text-md font-montserrat-semibold">
                Gần đây
              </Text>
              <Pressable onPress={handleClearRecent}>
                <Text className="text-primary text-sm font-montserrat-medium">
                  Xóa tất cả
                </Text>
              </Pressable>
            </View>

            <View className="gap-2">
              {recentSearches.map((search, index) => (
                <View key={index} className="flex-row items-center py-3">
                  <Pressable
                    onPress={() => handleRecentSearch(search)}
                    className="flex-row items-center flex-1"
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.textTertiary}
                    />
                    <Text className="text-text-primary text-md font-montserrat-regular ml-3">
                      {search}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleRemoveRecentSearch(search)}
                    className="p-2"
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color={colors.textTertiary}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Branch List */}
        <View className="px-4 mt-4">
          <Text className="text-text-primary text-md font-montserrat-semibold mb-3">
            {searchQuery.trim() ? "Kết quả tìm kiếm" : "Tất cả tiệm"}
          </Text>

          {branchesLoading || locationLoading ? (
            <View className="py-8">
              <Text className="text-text-secondary text-sm font-montserrat-regular text-center">
                Đang tải...
              </Text>
            </View>
          ) : filteredBranches.length === 0 ? (
            <View className="py-8">
              <Text className="text-text-secondary text-sm font-montserrat-regular text-center">
                {searchQuery.trim()
                  ? "Không tìm thấy tiệm nào"
                  : "Chưa có tiệm nào trong khu vực"}
              </Text>
            </View>
          ) : (
            <View className="gap-3 pb-4">
              {filteredBranches.map((branch) => (
                <ShopCard
                  key={branch.id}
                  id={branch.id.toString()}
                  name={branch.name}
                  address={branch.address?.addressText || ""}
                  variant="compact"
                  onPress={() => handleBranchPress(branch)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
