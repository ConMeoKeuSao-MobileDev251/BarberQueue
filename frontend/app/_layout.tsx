/**
 * Root Layout
 * Configures fonts, providers, and navigation
 */
import { useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import "react-native-reanimated";
import "../global.css";

// Providers
import { QueryProvider } from "@/src/providers/query-provider";

// UI Components
import { ErrorBoundary, ToastContainer } from "@/src/components/ui";

// i18n
import "@/src/i18n";

// Hooks
import { useColorScheme } from "@/hooks/use-color-scheme";

// Stores
import { useAppStore, useAuthStore } from "@/src/stores";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const initialize = useAppStore((state) => state.initialize);
  const isInitialized = useAppStore((state) => state.isInitialized);
  const onboardingComplete = useAppStore((state) => state.onboardingComplete);
  const restoreAuth = useAuthStore((state) => state.restoreAuth);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Load fonts
  const [fontsLoaded] = useFonts({
    "Montserrat-Light": Montserrat_300Light,
    "Montserrat-Regular": Montserrat_400Regular,
    "Montserrat-Medium": Montserrat_500Medium,
    "Montserrat-SemiBold": Montserrat_600SemiBold,
    "Montserrat-Bold": Montserrat_700Bold,
  });

  // Initialize app state and restore auth
  useEffect(() => {
    initialize();
    restoreAuth();
  }, [initialize, restoreAuth]);

  // Hide splash screen when ready
  useEffect(() => {
    if (fontsLoaded && isInitialized && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isInitialized, isAuthLoading]);

  // Auth guard - redirect based on auth state
  useEffect(() => {
    if (!fontsLoaded || !isInitialized || isAuthLoading) return;

    if (!onboardingComplete) {
      router.replace("/(onboarding)");
    } else if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
    // If authenticated, stay on current route (tabs)
  }, [fontsLoaded, isInitialized, isAuthLoading, isAuthenticated, onboardingComplete, router]);

  // Show nothing while loading
  if (!fontsLoaded || !isInitialized || isAuthLoading) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="shop" options={{ headerShown: false }} />
            <Stack.Screen name="checkout" options={{ headerShown: false }} />
            <Stack.Screen name="booking" options={{ headerShown: false }} />
            <Stack.Screen name="account" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <ToastContainer />
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
