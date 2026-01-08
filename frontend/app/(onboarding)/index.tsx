/**
 * Onboarding Screen
 * Swipeable intro pages with navigation
 */
import { View, Text, Dimensions, Pressable } from "react-native";
import { useRef, useState, useCallback } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { useAppStore } from "@/src/stores";
import { Button } from "@/src/components/ui/button";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Local onboarding images
const onboardingImage1 = require("../../assets/images/onboarding-image-1.png");
const onboardingImage2 = require("../../assets/images/onboarding-image-2.png");
const onboardingImage3 = require("../../assets/images/onboarding-image-3.jpg");

// Onboarding slides data
const slides = [
  {
    id: "1",
    image: onboardingImage1,
    titleKey: "onboarding.slide1.title",
    descriptionKey: "onboarding.slide1.description",
  },
  {
    id: "2",
    image: onboardingImage2,
    titleKey: "onboarding.slide2.title",
    descriptionKey: "onboarding.slide2.description",
  },
  {
    id: "3",
    image: onboardingImage3,
    titleKey: "onboarding.slide3.title",
    descriptionKey: "onboarding.slide3.description",
  },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);

  const scrollRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleComplete = useCallback(async () => {
    await setOnboardingComplete(true);
    router.replace("/(auth)/login" as never);
  }, [setOnboardingComplete, router]);

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  }, [currentIndex, handleComplete]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  return (
    <View className="flex-1 bg-dark">
      {/* Slides */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(newIndex);
        }}
      >
        {slides.map((slide, index) => (
          <SlideItem
            key={slide.id}
            slide={slide}
            index={index}
            scrollX={scrollX}
            t={t}
          />
        ))}
      </Animated.ScrollView>

      {/* Bottom Controls */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Page Indicator */}
        <View className="flex-row justify-center items-center gap-2 mb-8">
          {slides.map((_, index) => (
            <PageDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        {/* Buttons */}
        <View className="flex-row gap-4">
          {currentIndex < slides.length - 1 && (
            <View className="flex-1">
              <Pressable onPress={handleSkip} className="py-4 items-center">
                <Text className="text-white font-montserrat-medium text-md">
                  {t("common.skip")}
                </Text>
              </Pressable>
            </View>
          )}
          <View className="flex-1">
            <Button variant="gradient" onPress={handleNext} fullWidth>
              {currentIndex === slides.length - 1
                ? t("onboarding.getStarted")
                : t("common.continue")}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

interface SlideItemProps {
  slide: typeof slides[0];
  index: number;
  scrollX: SharedValue<number>;
  t: (key: string) => string;
}

function SlideItem({ slide, index, scrollX, t }: SlideItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]);
    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9]);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
      {/* Background Image */}
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <Image
          source={slide.image}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["transparent", "rgba(26, 26, 26, 0.8)", "rgba(26, 26, 26, 1)"]}
        locations={[0.4, 0.7, 1]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: SCREEN_HEIGHT * 0.5,
        }}
      />

      {/* Content */}
      <View className="absolute bottom-48 left-6 right-6">
        <Text className="text-white text-3xl font-montserrat-bold text-center mb-4">
          {t(slide.titleKey)}
        </Text>
        <Text className="text-white/80 text-md font-montserrat-regular text-center">
          {t(slide.descriptionKey)}
        </Text>
      </View>
    </View>
  );
}

interface PageDotProps {
  index: number;
  scrollX: SharedValue<number>;
}

function PageDot({ index, scrollX }: PageDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const width = interpolate(scrollX.value, inputRange, [8, 24, 8], "clamp");
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], "clamp");

    return {
      width: withTiming(width, { duration: 200 }),
      opacity: withTiming(opacity, { duration: 200 }),
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="h-2 rounded-full bg-white"
    />
  );
}
