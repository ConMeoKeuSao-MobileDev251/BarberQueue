/**
 * Stylist Selection Screen
 * Choose stylist for the booking
 */
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { useCartStore } from "@/src/stores";
import { branchesApi } from "@/src/api";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { StylistCard, AnyStylistCard } from "@/src/components/shared/stylist-card";
import { CategoryTabs } from "@/src/components/shared/filter-chips";
import { Button } from "@/src/components/ui/button";
import { colors } from "@/src/constants/theme";

const tabs = [
  { id: "schedule", label: "Đặt lịch" },
  { id: "portfolio", label: "Mẫu" },
  { id: "reviews", label: "Đánh giá" },
];

export default function StylistScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { setStaff, staffId, branchId } = useCartStore();
  const [selectedTab, setSelectedTab] = useState("schedule");
  const [selectedStylist, setSelectedStylist] = useState<number | null>(staffId);

  // Fetch staff for the branch
  const {
    data: staffData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["branch-staff", branchId],
    queryFn: () => branchesApi.getStaffByBranch(branchId!),
    enabled: !!branchId,
  });

  // Filter to only show users with role "staff"
  const staffList = staffData?.filter((user) => user.role === "staff") ?? [];

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

            {/* Loading State */}
            {isLoading && (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="text-text-secondary text-sm font-montserrat-regular mt-2">
                  Đang tải danh sách thợ...
                </Text>
              </View>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <View className="py-8 items-center">
                <Text className="text-coral text-md font-montserrat-medium">
                  Không thể tải danh sách thợ
                </Text>
                <Text className="text-text-secondary text-sm font-montserrat-regular mt-1">
                  Vui lòng thử lại sau
                </Text>
              </View>
            )}

            {/* Empty State */}
            {!isLoading && !error && staffList.length === 0 && (
              <View className="py-8 items-center">
                <Text className="text-text-secondary text-md font-montserrat-medium">
                  Chưa có thợ nào
                </Text>
              </View>
            )}

            {/* Stylist List */}
            {!isLoading && staffList.map((staff) => (
              <StylistCard
                key={staff.id}
                id={staff.id.toString()}
                name={staff.fullName}
                specialty="Barber"
                isAvailable={true}
                avatar={null}
                onPress={() => handleSelectStylist(staff.id, staff.fullName)}
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
