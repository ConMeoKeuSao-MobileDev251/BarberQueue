/**
 * Bookings Screen
 * Booking history with tabs for past, upcoming, and favorites
 */
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { bookingsApi } from "@/src/api/bookings";
import { useAuthStore } from "@/src/stores";
import { showToast } from "@/src/components/ui/toast";
import type { Booking } from "@/src/types";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { CategoryTabs } from "@/src/components/shared/filter-chips";
import { BookingCard } from "@/src/components/shared/booking-card";
import { SkeletonCard } from "@/src/components/ui/skeleton";
import { EmptyBookings, EmptyFavorites } from "@/src/components/ui/empty-state";
import { ConfirmDialog } from "@/src/components/layout/modal";

type TabType = "past" | "upcoming" | "favorites";

const tabs = [
  { id: "past", label: "Đã đặt" },
  { id: "upcoming", label: "Sắp đến" },
  { id: "favorites", label: "Yêu thích" },
];

export default function BookingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [refreshing, setRefreshing] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  // Fetch bookings - API returns array directly
  const {
    data: bookings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingsApi.getHistory({ page: 1, limit: 50 }),
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: (bookingId: number) => bookingsApi.changeStatus(bookingId, "cancel"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setCancelModalVisible(false);
      setSelectedBookingId(null);
      showToast("Đã hủy lịch hẹn", "success");
    },
    onError: () => {
      showToast("Không thể hủy lịch hẹn", "error");
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleBookingPress = (bookingId: number) => {
    router.push(`/booking/${bookingId}` as never);
  };

  const handleCancelPress = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBookingId) {
      cancelMutation.mutate(selectedBookingId);
    }
  };

  const handleRebook = (bookingId: number) => {
    // TODO: Navigate to rebook flow
    router.push("/(tabs)");
  };

  // Filter bookings based on active tab (API returns array directly)
  const filteredBookings: Booking[] = bookings?.filter((booking: Booking) => {
    const now = new Date();
    const bookingDate = new Date(booking.startAt);

    switch (activeTab) {
      case "past":
        return bookingDate < now || booking.status === "completed" || booking.status === "cancelled";
      case "upcoming":
        return bookingDate >= now && booking.status !== "cancelled" && booking.status !== "completed";
      case "favorites":
        return false; // Placeholder - no favorites API
      default:
        return true;
    }
  }) || [];

  const renderEmptyState = () => {
    switch (activeTab) {
      case "favorites":
        return <EmptyFavorites onAction={() => router.push("/(tabs)")} />;
      default:
        return <EmptyBookings onAction={() => router.push("/(tabs)")} />;
    }
  };

  return (
    <View className="flex-1 bg-background-secondary">
      {/* Header with back button */}
      <ScreenHeader title={t("booking.history")} />

      {/* Tabs */}
      <View className="bg-white px-4 pb-4">
        <CategoryTabs
          categories={tabs}
          selected={activeTab}
          onChange={(id) => setActiveTab(id as TabType)}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-4 py-4 gap-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id.toString()}
                shopName={booking.staff?.fullName || "Barbershop"}
                shopImage={null}
                status={booking.status}
                date={booking.startAt}
                time={new Date(booking.startAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                services={
                  booking.services?.map((s) => ({
                    id: s.id.toString(),
                    name: s.name,
                    price: s.price,
                  })) || []
                }
                totalPrice={booking.totalPrice}
                onPress={() => handleBookingPress(booking.id)}
                onCancel={
                  booking.status === "pending" || booking.status === "confirmed"
                    ? () => handleCancelPress(booking.id)
                    : undefined
                }
                onRebook={
                  booking.status === "completed" || booking.status === "cancelled"
                    ? () => handleRebook(booking.id)
                    : undefined
                }
              />
            ))
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <ConfirmDialog
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleConfirmCancel}
        title="Hủy lịch hẹn"
        message={t("booking.cancelConfirm")}
        confirmLabel={t("booking.cancel")}
        cancelLabel={t("common.cancel")}
        destructive
      />
    </View>
  );
}
