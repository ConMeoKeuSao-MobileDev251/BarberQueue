/**
 * Address Search Screen
 * Search and add new addresses
 * Note: Map integration is placeholder - requires expo-maps or react-native-maps
 */
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { addressesApi } from "@/src/api/addresses";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { SearchInput } from "@/src/components/ui/search-input";
import { Button } from "@/src/components/ui/button";
import { showToast } from "@/src/components/ui/toast";
import { colors } from "@/src/constants/theme";

// Mock address suggestions (in production, use Google Places API or similar)
const mockSuggestions = [
  {
    id: "1",
    name: "123 Nguyễn Huệ",
    address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    id: "2",
    name: "456 Lê Lợi",
    address: "456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
    lat: 10.7731,
    lng: 106.6981,
  },
  {
    id: "3",
    name: "789 Pasteur",
    address: "789 Pasteur, Phường Bến Nghé, Quận 3, TP.HCM",
    lat: 10.7830,
    lng: 106.6900,
  },
];

interface SelectedAddress {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export default function AddressSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Create address mutation
  const createMutation = useMutation({
    mutationFn: addressesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast("Đã thêm địa chỉ mới", "success");
      router.back();
    },
    onError: () => {
      showToast("Không thể thêm địa chỉ", "error");
    },
  });

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  }, [searchQuery]);

  const handleSelectSuggestion = (suggestion: typeof mockSuggestions[0]) => {
    setSelectedAddress({
      name: suggestion.name,
      address: suggestion.address,
      lat: suggestion.lat,
      lng: suggestion.lng,
    });
    setSearchQuery(suggestion.address);
    setShowResults(false);
  };

  const handleUseCurrentLocation = () => {
    // In production, use expo-location to get current location
    setSelectedAddress({
      name: "Vị trí hiện tại",
      address: "Quận 1, TP. Hồ Chí Minh",
      lat: 10.7769,
      lng: 106.7009,
    });
    setSearchQuery("Quận 1, TP. Hồ Chí Minh");
    setShowResults(false);
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      createMutation.mutate({
        addressText: selectedAddress.address,
        latitude: selectedAddress.lat,
        longitude: selectedAddress.lng,
      });
    }
  };

  const handleChangeAddress = () => {
    setSelectedAddress(null);
    setSearchQuery("");
    setShowResults(false);
  };

  // Filter suggestions based on search query
  const filteredSuggestions = searchQuery.trim()
    ? mockSuggestions.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockSuggestions;

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title="Thêm địa chỉ" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Search Section */}
        <View className="bg-white p-4">
          <Text className="text-text-secondary text-sm font-montserrat-regular mb-2">
            Nhập địa chỉ của bạn
          </Text>

          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <SearchInput
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setShowResults(true);
                  setSelectedAddress(null);
                }}
                placeholder="Tìm kiếm địa chỉ..."
                onSubmit={handleSearch}
                onClear={() => {
                  setSearchQuery("");
                  setShowResults(false);
                  setSelectedAddress(null);
                }}
              />
            </View>
            <Pressable
              onPress={handleUseCurrentLocation}
              className="w-12 h-12 rounded-lg bg-primary-light items-center justify-center"
            >
              <Ionicons name="locate" size={24} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Search Results */}
        {showResults && !selectedAddress && (
          <ScrollView className="flex-1 bg-white mt-2">
            {filteredSuggestions.map((suggestion) => (
              <Pressable
                key={suggestion.id}
                onPress={() => handleSelectSuggestion(suggestion)}
                className="flex-row items-start px-4 py-4 border-b border-border-light"
              >
                <Ionicons name="location" size={20} color={colors.primary} />
                <View className="flex-1 ml-3">
                  <Text className="text-text-primary text-md font-montserrat-medium">
                    {suggestion.name}
                  </Text>
                  <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                    {suggestion.address}
                  </Text>
                </View>
              </Pressable>
            ))}

            {filteredSuggestions.length === 0 && (
              <View className="items-center py-8">
                <Ionicons name="search" size={48} color={colors.textTertiary} />
                <Text className="text-text-secondary text-md font-montserrat-regular mt-4">
                  Không tìm thấy địa chỉ
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Map Placeholder */}
        {selectedAddress && (
          <View className="flex-1">
            {/* Map View Placeholder */}
            <View className="flex-1 bg-gray-200 items-center justify-center">
              <Ionicons name="map" size={64} color={colors.textTertiary} />
              <Text className="text-text-secondary text-md font-montserrat-regular mt-4">
                Bản đồ sẽ hiển thị ở đây
              </Text>
              <Text className="text-text-tertiary text-sm font-montserrat-regular mt-1">
                (Tích hợp expo-maps)
              </Text>

              {/* Location Pin Overlay */}
              <View className="absolute">
                <Ionicons name="location" size={48} color={colors.primary} />
              </View>
            </View>

            {/* Selected Address Card */}
            <View className="bg-white p-4 border-t border-border-light">
              <View className="flex-row items-start">
                <Ionicons name="location" size={20} color={colors.primary} />
                <View className="flex-1 ml-3">
                  <Text className="text-text-primary text-md font-montserrat-semibold">
                    {selectedAddress.name}
                  </Text>
                  <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                    {selectedAddress.address}
                  </Text>
                </View>
                <Pressable onPress={handleChangeAddress}>
                  <Text className="text-primary text-sm font-montserrat-medium">
                    Thay đổi
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Bottom Button */}
      {selectedAddress && (
        <View
          className="bg-white px-4 pt-4 border-t border-border-light"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Button
            variant="gradient"
            onPress={handleConfirm}
            loading={createMutation.isPending}
            fullWidth
          >
            Xác nhận địa chỉ
          </Button>
        </View>
      )}
    </View>
  );
}
