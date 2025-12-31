/**
 * App Store
 * Manages global app settings and state
 */
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/config";

type Language = "vi" | "en";

interface AppState {
  // State
  language: Language;
  onboardingComplete: boolean;
  isInitialized: boolean;

  // Actions
  setLanguage: (language: Language) => Promise<void>;
  setOnboardingComplete: (complete: boolean) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  language: "vi",
  onboardingComplete: false,
  isInitialized: false,

  // Set language
  setLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch {
      // Storage not available
    }
    set({ language });
  },

  // Set onboarding complete
  setOnboardingComplete: async (complete) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ONBOARDING_COMPLETE,
        JSON.stringify(complete)
      );
    } catch {
      // Storage not available
    }
    set({ onboardingComplete: complete });
  },

  // Initialize app state from storage
  initialize: async () => {
    try {
      const [language, onboardingComplete] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE),
      ]);

      set({
        language: (language as Language) || "vi",
        onboardingComplete: onboardingComplete === "true",
        isInitialized: true,
      });
    } catch {
      set({ isInitialized: true });
    }
  },
}));

// Selector hooks
export const useLanguage = () => useAppStore((state) => state.language);
export const useOnboardingComplete = () =>
  useAppStore((state) => state.onboardingComplete);
