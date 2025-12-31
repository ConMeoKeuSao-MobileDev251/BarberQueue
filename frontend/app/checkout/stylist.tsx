/**
 * Stylist Selection Screen
 * Choose stylist for the booking
 */
import { View, Text, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useCartStore } from "@/src/stores";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { StylistCard, AnyStylistCard } from "@/src/components/shared/stylist-card";
import { CategoryTabs } from "@/src/components/shared/filter-chips";
import { Button } from "@/src/components/ui/button";

const tabs = [
  { id: "schedule", label: "Đặt lịch" },
  { id: "portfolio", label: "Mẫu" },
  { id: "reviews", label: "Đánh giá" },
];

// Mock staff data
const mockStaff = [
  { id: 1, name: "Minh Tuấn", specialty: "Cắt tóc nam", rating: 4.9, reviewCount: 156, isAvailable: true },
  { id: 2, name: "Hoàng Long", specialty: "Cắt tóc & Nhuộm", rating: 4.8, reviewCount: 203, isAvailable: true },
  { id: 3, name: "Văn Đức", specialty: "Combo", rating: 4.7, reviewCount: 89, isAvailable: false },
  { id: 4, name: "Quốc Bảo", specialty: "Cạo râu", rating: 4.6, reviewCount: 67, isAvailable: true },
];

export default function StylistScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { setStaff, staffId } = useCartStore();
  const [selectedTab, setSelectedTab] = useState("schedule");
  const [selectedStylist, setSelectedStylist] = useState<number | null>(staffId);

  // Use mock data for now since API may not have staff availability
  const staffList = mockStaff;

  const handleSelectStylist = (id: number | null, name: string) => {
    setSelectedStylist(id);
    setStaff(id, name);
  };

  const handleContinue = () => {
    router.push("/checkout/datetime" as never);
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title={t("checkout.selectStylist")} />

      {/* Tabs */}
      <View className="bg-white pb-2">
        <CategoryTabs
          categories={tabs}
          selected={selectedTab}
          onChange={setSelectedTab}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {selectedTab === "schedule" && (
          <View className="p-4 gap-3">
            {/* Any Stylist Option */}
            <AnyStylistCard
              onPress={() => handleSelectStylist(null, "Thợ bất kỳ")}
              selected={selectedStylist === null}
            />

            {/* Stylist List */}
            {staffList.map((staff) => (
              <StylistCard
                key={staff.id}
                id={staff.id.toString()}
                name={staff.name}
                specialty={staff.specialty}
                rating={staff.rating}
                reviewCount={staff.reviewCount}
                isAvailable={staff.isAvailable}
                avatar={null}
                onPress={() => {
                  if (staff.isAvailable) {
                    handleSelectStylist(staff.id, staff.name);
                  }
                }}
                selected={selectedStylist === staff.id}
              />
            ))}
          </View>
        )}

        {selectedTab === "portfolio" && (
          <View className="p-4">
            <Text className="text-text-secondary text-md font-montserrat-regular text-center">
              Chưa có mẫu tóc nào
            </Text>
          </View>
        )}

        {selectedTab === "reviews" && (
          <View className="p-4">
            <Text className="text-text-secondary text-md font-montserrat-regular text-center">
              Chưa có đánh giá nào
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 border-t border-border-light"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          variant="gradient"
          onPress={handleContinue}
          fullWidth
          disabled={selectedStylist === undefined}
        >
          {t("common.continue")}
        </Button>
      </View>
    </View>
  );
}
