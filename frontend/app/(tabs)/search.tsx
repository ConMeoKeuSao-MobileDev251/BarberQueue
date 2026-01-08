/**
 * Search Screen
 * Search for shops and services with local storage for recent searches
 */
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SearchInput } from "@/src/components/ui/search-input";
import { EmptySearchResults } from "@/src/components/ui/empty-state";
import { colors } from "@/src/constants/theme";
import { useLocation } from "@/src/hooks";

const RECENT_SEARCHES_KEY = "@barberqueue:recent_searches";
const MAX_RECENT_SEARCHES = 10;

// Hot services placeholder data
const hotServices = [
  { id: "1", name: "Cắt tóc", icon: "cut" as const },
  { id: "2", name: "Uốn tóc", icon: "color-wand" as const },
  { id: "3", name: "Nhuộm", icon: "color-palette" as const },
  { id: "4", name: "Gội đầu", icon: "water" as const },
  { id: "5", name: "Tạo kiểu", icon: "sparkles" as const },
  { id: "6", name: "Cạo râu", icon: "man" as const },
];

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    locationName,
    isLoading: locationLoading,
    refresh: refreshLocation,
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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

        // Remove duplicate and add to front
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

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      setHasSearched(true);
      // TODO: Implement search API call when backend supports it
    }
  }, [searchQuery, saveRecentSearch]);

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

  const handleRecentSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      saveRecentSearch(query);
      setHasSearched(true);
    },
    [saveRecentSearch]
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
          onSubmit={handleSearch}
          onClear={() => {
            setSearchQuery("");
            setHasSearched(false);
          }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {!hasSearched ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
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

            {/* Hot Services */}
            <View className="px-4 mt-6">
              <Text className="text-text-primary text-md font-montserrat-semibold mb-3">
                Dịch vụ hot
              </Text>

              <View className="flex-row flex-wrap gap-3">
                {hotServices.map((service) => (
                  <Pressable key={service.id} className="items-center w-20">
                    <View className="w-16 h-16 rounded-full bg-primary-light items-center justify-center mb-2">
                      <Ionicons
                        name={service.icon}
                        size={28}
                        color={colors.primary}
                      />
                    </View>
                    <Text className="text-text-primary text-xs font-montserrat-medium text-center">
                      {service.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        ) : (
          // Search Results
          <View className="flex-1 px-4 mt-4">
            {/* No results placeholder - replace with actual search results */}
            <EmptySearchResults
              onAction={() => {
                setSearchQuery("");
                setHasSearched(false);
              }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
