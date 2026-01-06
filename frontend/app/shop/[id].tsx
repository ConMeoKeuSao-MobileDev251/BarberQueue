/**
 * Shop Details Screen
 * Display shop info, services, and add to cart
 */
import { View, Text, ScrollView, Pressable, Linking, Share } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { servicesApi } from "@/src/api/services";
import { reviewsApi } from "@/src/api/reviews";
import { useCartStore } from "@/src/stores";
import type { Service, Review } from "@/src/types";
import { Rating } from "@/src/components/ui/rating";
import { Badge } from "@/src/components/ui/badge";
import { ServiceCard } from "@/src/components/shared/service-card";
import { CategoryTabs } from "@/src/components/shared/filter-chips";
import { SkeletonServiceCard } from "@/src/components/ui/skeleton";
import { colors } from "@/src/constants/theme";

// Service categories
const categories = [
  { id: "all", label: "Tất cả" },
  { id: "recommended", label: "Nên thử" },
  { id: "combo", label: "Combo" },
  { id: "haircut", label: "Cắt tóc" },
  { id: "facial", label: "Chăm sóc da" },
];

export default function ShopDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFavorite, setIsFavorite] = useState(false);

  // Cart store
  const { items, addItem, removeItem, setBranch, totalItems, totalPrice } = useCartStore();

  // Fetch services
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: servicesApi.getAll,
  });

  // Fetch reviews for this branch
  const branchId = parseInt(id || "0");
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
        setBranch(parseInt(id || "0"), "Barbershop");
      }
      addItem(service);
    }
  };

  // Actions
  const handleBack = () => router.back();

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out this barbershop on BarberQueue!",
        url: `barberqueue://shop/${id}`,
      });
    } catch {
      // Share cancelled
    }
  };

  const handleCall = () => {
    Linking.openURL("tel:+84123456789");
  };

  const handleDirections = () => {
    Linking.openURL("https://maps.google.com/?q=10.7769,106.7009");
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
        <View className="relative h-64">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800" }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.6)"]}
            locations={[0, 0.5, 1]}
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
        </View>

        {/* Shop Info Card */}
        <View className="bg-white mx-4 -mt-8 rounded-xl p-4 shadow-md relative z-10">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Badge variant="primary">CẮT TÓC NAM</Badge>
              <Text className="text-text-primary text-xl font-montserrat-bold mt-2">
                Barbershop Premium
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text className="text-text-secondary text-sm font-montserrat-regular ml-1">
                  123 Nguyễn Huệ, Quận 1 • 1.2km
                </Text>
              </View>
            </View>

            {/* Favorite Button */}
            <Pressable onPress={() => setIsFavorite(!isFavorite)}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? colors.coral : colors.textSecondary}
              />
            </Pressable>
          </View>

          {/* Action Row */}
          <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-border-light">
            <Pressable
              onPress={handleCall}
              className="flex-row items-center"
            >
              <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center">
                <Ionicons name="call" size={18} color={colors.primary} />
              </View>
              <Text className="text-text-primary text-sm font-montserrat-medium ml-2">
                {t("shop.call")}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDirections}
              className="flex-row items-center"
            >
              <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center">
                <Ionicons name="navigate" size={18} color={colors.primary} />
              </View>
              <Text className="text-text-primary text-sm font-montserrat-medium ml-2">
                {t("shop.directions")}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleShare}
              className="flex-row items-center"
            >
              <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center">
                <Ionicons name="share-social" size={18} color={colors.primary} />
              </View>
              <Text className="text-text-primary text-sm font-montserrat-medium ml-2">
                {t("shop.share")}
              </Text>
            </Pressable>

            <Rating score={4.8} count={256} size="md" />
          </View>
        </View>

        {/* Service Categories */}
        <View className="mt-6">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </View>

        {/* Services List */}
        <View className="px-4 mt-4">
          <Text className="text-text-primary text-lg font-montserrat-semibold mb-3">
            {t("shop.services")}
          </Text>

          {isLoading ? (
            <View className="gap-4">
              <SkeletonServiceCard />
              <SkeletonServiceCard />
              <SkeletonServiceCard />
            </View>
          ) : (
            <View className="gap-4">
              {services?.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id.toString()}
                  name={service.name}
                  price={service.price}
                  duration={service.duration}
                  image={null}
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
