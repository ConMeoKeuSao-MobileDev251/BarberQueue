/**
 * Shop Details Screen
 * Display shop info, services, and add to cart
 */
import { View, Text, ScrollView, Pressable, Linking, Share } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { servicesApi } from "@/src/api/services";
import { reviewsApi } from "@/src/api/reviews";
import { favoritesApi } from "@/src/api/favorites";
import { branchesApi } from "@/src/api/branches";
import { useCartStore, useCartTotalItems, useCartTotalPrice, useAuthStore } from "@/src/stores";
import type { Service, Review, Branch } from "@/src/types";
import { ServiceCard } from "@/src/components/shared/service-card";
import { SkeletonServiceCard } from "@/src/components/ui/skeleton";
import { colors } from "@/src/constants/theme";
import { getServiceIcon } from "@/src/constants/service-icons";

// Local assets
const shopHeroImage = require("../../assets/images/shop-hero-image.png");

export default function ShopDetailsScreen() {
  const { id, branchData } = useLocalSearchParams<{ id: string; branchData?: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const branchId = parseInt(id || "0");

  // Parse branch data from navigation params (if passed)
  const passedBranch: Branch | null = branchData ? JSON.parse(branchData) : null;

  // Fetch branch data if not passed via params (e.g., from booking history)
  const { data: fetchedBranch } = useQuery({
    queryKey: ["branch", branchId],
    queryFn: async () => {
      const branches = await branchesApi.getAll();
      return branches.find((b) => b.id === branchId) || null;
    },
    enabled: !passedBranch && branchId > 0,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Use passed branch data or fetched branch data
  const branch = passedBranch || fetchedBranch || null;

  // Track branch viewed event
  useEffect(() => {
    if (branch) {
      Sentry.captureMessage("branch_viewed", {
        level: "info",
        tags: { action: "engagement" },
        extra: {
          branchId: branch.id,
          branchName: branch.name,
        },
      });
    }
  }, [branch?.id]);

  // Auth store - check if user is client
  const { user, isAuthenticated } = useAuthStore();
  const isClient = isAuthenticated && user?.role === "client";

  // Cart store
  const { items, addItem, removeItem, setBranch } = useCartStore();
  const totalItems = useCartTotalItems();
  const totalPrice = useCartTotalPrice();

  // Fetch user favorites
  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: favoritesApi.getAll,
    enabled: isClient,
  });

  // Check if this branch is favorited (API returns Favorite[] directly)
  const isFavorite = favoritesData?.some((f) => f.branchId === branchId) ?? false;

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: favoritesApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error: unknown) => {
      // Log detailed error info for debugging
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.error("Failed to add favorite:", axiosError.response?.status, axiosError.response?.data);
      } else {
        console.error("Failed to add favorite:", error);
      }
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.error("Failed to remove favorite:", axiosError.response?.status, axiosError.response?.data);
      } else {
        console.error("Failed to remove favorite:", error);
      }
    },
  });

  // Toggle favorite handler
  const handleToggleFavorite = () => {
    if (!isClient) return;
    if (isFavorite) {
      removeFavoriteMutation.mutate(branchId);
    } else {
      addFavoriteMutation.mutate(branchId);
    }
  };

  // Fetch services (global services, branchId in key for cache isolation)
  const { data: services, isLoading } = useQuery({
    queryKey: ["services", "branch", branchId],
    queryFn: servicesApi.getAll,
    enabled: branchId > 0,
  });

  // Fetch reviews for this branch
  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", "branch", branchId],
    queryFn: () => reviewsApi.getByBranchId(branchId, { page: 1, limit: 5 }),
    enabled: branchId > 0,
  });

  // Check if service is in cart
  const isInCart = (serviceId: number) => {
    return items.some((item) => item.service.id === serviceId);
  };

  // Handle add/remove from cart
  const handleToggleCart = (service: Service) => {
    if (!service) return;

    if (isInCart(service.id)) {
      removeItem(service.id);
    } else {
      // Set branch if not set
      if (!useCartStore.getState().branchId) {
        setBranch(branchId, branch?.name || "Barbershop");
      }
      addItem(service);
    }
  };

  // Calculate average rating from reviews
  const averageRating = reviewsData?.data && reviewsData.data.length > 0
    ? Math.round((reviewsData.data.reduce((sum, r) => sum + r.rating, 0) / reviewsData.data.length) * 10) / 10
    : 0;
  const reviewCount = reviewsData?.total ?? 0;

  // Actions
  const handleBack = () => router.back();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${branch?.name || "this barbershop"} on BarberQueue!`,
        url: `barberqueue://shop/${id}`,
      });
    } catch {
      // Share cancelled
    }
  };

  const handleCall = () => {
    const phone = branch?.phoneNumber;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleDirections = () => {
    const lat = branch?.address?.latitude;
    const lng = branch?.address?.longitude;
    if (lat && lng) {
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
    }
  };

  const handleContinue = () => {
    router.push("/checkout" as never);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Image */}
        <View className="relative h-80">
          <Image
            source={shopHeroImage}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />

          {/* Gradient Overlay - darker at bottom for text legibility */}
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "transparent", "rgba(0,0,0,0.75)"]}
            locations={[0, 0.4, 1]}
            style={{ position: "absolute", inset: 0 }}
          />

          {/* Top Actions */}
          <View
            className="absolute left-0 right-0 flex-row justify-between px-4"
            style={{ top: insets.top + 8 }}
          >
            <Pressable
              onPress={handleBack}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </Pressable>
            <Pressable
              onPress={handleShare}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Ionicons name="share-outline" size={24} color="white" />
            </Pressable>
          </View>

          {/* Bottom Overlay Content - Shop info on image */}
          <View className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <View className="flex-row justify-between items-start">
              {/* Left: Shop Info */}
              <View className="flex-1 pr-4">
                <Text className="text-white/80 text-xs font-montserrat-semibold tracking-wider uppercase">
                  CẮT TÓC NAM
                </Text>
                <Text
                  className="text-white text-2xl font-montserrat-bold mt-1"
                  numberOfLines={2}
                >
                  {branch?.name || "Loading..."}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Ionicons name="location" size={14} color="rgba(255,255,255,0.9)" />
                  <Text
                    className="text-white/90 text-sm font-montserrat-regular ml-1 flex-1"
                    numberOfLines={2}
                  >
                    {branch?.address?.addressText || "..."}
                  </Text>
                </View>
              </View>

              {/* Right: Favorite Button */}
              {isClient && (
                <Pressable
                  onPress={handleToggleFavorite}
                  disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                  className="items-center"
                >
                  <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                    <Ionicons
                      name={isFavorite ? "heart" : "heart-outline"}
                      size={22}
                      color="white"
                    />
                  </View>
                  <Text className="text-white text-xs font-montserrat-regular mt-1">
                    Yêu thích
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* Action Bar - Flat icons + Rating pill */}
        <View className="bg-white px-4 py-3 flex-row items-center justify-between">
          {/* Action Buttons - Flat icons, grouped left */}
          <View className="flex-row items-center">
            <Pressable onPress={handleCall} className="items-center mr-6">
              <Ionicons name="call-outline" size={22} color={colors.primary} />
              <Text className="text-primary text-xs font-montserrat-medium mt-1">
                Liên hệ
              </Text>
            </Pressable>

            <Pressable onPress={handleDirections} className="items-center mr-6">
              <Ionicons name="location-outline" size={22} color={colors.primary} />
              <Text className="text-primary text-xs font-montserrat-medium mt-1">
                Chỉ đường
              </Text>
            </Pressable>

            <Pressable onPress={handleShare} className="items-center">
              <Ionicons name="share-outline" size={22} color={colors.primary} />
              <Text className="text-primary text-xs font-montserrat-medium mt-1">
                Chia sẻ
              </Text>
            </Pressable>
          </View>

          {/* Rating Pill */}
          <View className="flex-row items-center">
            {reviewCount > 0 ? (
              <>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-2 py-1">
                  <Ionicons name="star" size={16} color={colors.rating} />
                  <Text className="text-text-primary text-sm font-montserrat-bold ml-1">
                    {averageRating.toFixed(1)}
                  </Text>
                </View>
                <Text className="text-text-secondary text-sm font-montserrat-regular ml-2">
                  {reviewCount} đánh giá
                </Text>
              </>
            ) : (
              <Text className="text-text-tertiary text-sm font-montserrat-regular">
                Chưa có đánh giá
              </Text>
            )}
          </View>
        </View>

        {/* Services List */}
        <View className="px-4 mt-6">
          <Text className="text-text-primary text-lg font-montserrat-semibold mb-3">
            {t("shop.services")}
          </Text>

          {isLoading ? (
            <View className="gap-4">
              <SkeletonServiceCard />
              <SkeletonServiceCard />
              <SkeletonServiceCard />
            </View>
          ) : !services || services.length === 0 ? (
            <View className="bg-white rounded-xl p-6">
              <Text className="text-text-secondary text-sm font-montserrat-regular text-center">
                Chưa có dịch vụ nào
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id.toString()}
                  name={service.name}
                  price={service.price}
                  duration={service.duration}
                  image={getServiceIcon(service.name)}
                  variant="horizontal"
                  onPress={() => {}}
                  onAddToCart={() => handleToggleCart(service)}
                  inCart={isInCart(service.id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Reviews Section */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-primary text-lg font-montserrat-semibold">
              {t("shop.reviews")}
            </Text>
            {reviewsData && reviewsData.total > 0 && (
              <Text className="text-text-secondary text-sm font-montserrat-regular">
                {reviewsData.total} đánh giá
              </Text>
            )}
          </View>

          {isLoadingReviews ? (
            <View className="bg-white rounded-xl p-4">
              <Text className="text-text-secondary text-sm font-montserrat-regular">
                Đang tải đánh giá...
              </Text>
            </View>
          ) : reviewsData?.data && reviewsData.data.length > 0 ? (
            <View className="gap-3">
              {reviewsData.data.map((review: Review) => (
                <View key={review.id} className="bg-white rounded-xl p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-full bg-primary-light items-center justify-center">
                        <Text className="text-primary text-sm font-montserrat-bold">
                          {review.user?.fullName?.charAt(0) || "U"}
                        </Text>
                      </View>
                      <Text className="text-text-primary text-sm font-montserrat-medium ml-2">
                        {review.user?.fullName || "Khách hàng"}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= review.rating ? "star" : "star-outline"}
                          size={14}
                          color={star <= review.rating ? colors.rating : colors.textSecondary}
                        />
                      ))}
                    </View>
                  </View>
                  {review.comment && (
                    <Text className="text-text-secondary text-sm font-montserrat-regular">
                      {review.comment}
                    </Text>
                  )}
                  <Text className="text-text-tertiary text-xs font-montserrat-regular mt-2">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-xl p-4">
              <Text className="text-text-secondary text-sm font-montserrat-regular text-center">
                Chưa có đánh giá nào
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Cart Bar */}
      {totalItems > 0 && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-primary px-4 py-4 flex-row items-center"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="flex-row items-center flex-1">
            <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
              <Text className="text-primary text-sm font-montserrat-bold">
                {totalItems}
              </Text>
            </View>
            <Text className="text-white text-lg font-montserrat-bold ml-3">
              {formatPrice(totalPrice)}
            </Text>
          </View>

          <Pressable
            onPress={handleContinue}
            className="bg-white px-6 py-3 rounded-full"
          >
            <Text className="text-primary text-md font-montserrat-semibold">
              {t("common.continue")}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
