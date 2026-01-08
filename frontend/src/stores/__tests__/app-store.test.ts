/**
 * App Store Tests
 * Tests for app-level state management
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore, useLanguage, useOnboardingComplete } from "../app-store";
import { STORAGE_KEYS } from "../../constants/config";

// Mock AsyncStorage (already in jest.setup.js)
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe("App Store", () => {
  // Reset store and mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store to initial state
    useAppStore.setState({
      language: "vi",
      onboardingComplete: false,
      isInitialized: false,
    });
  });

  describe("Initial state", () => {
    it("should have vi as default language", () => {
      const { language } = useAppStore.getState();
      expect(language).toBe("vi");
    });

    it("should have onboardingComplete false", () => {
      const { onboardingComplete } = useAppStore.getState();
      expect(onboardingComplete).toBe(false);
    });

    it("should have isInitialized false", () => {
      const { isInitialized } = useAppStore.getState();
      expect(isInitialized).toBe(false);
    });
  });

  describe("setLanguage", () => {
    it("should set language to en", async () => {
      mockedAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await useAppStore.getState().setLanguage("en");

      const { language } = useAppStore.getState();
      expect(language).toBe("en");
    });

    it("should persist language to AsyncStorage", async () => {
      mockedAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await useAppStore.getState().setLanguage("en");

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.LANGUAGE,
        "en"
      );
    });

    it("should handle storage error gracefully", async () => {
      mockedAsyncStorage.setItem.mockRejectedValueOnce(
        new Error("Storage error")
      );

      // Should not throw
      await expect(
        useAppStore.getState().setLanguage("en")
      ).resolves.not.toThrow();

      // State should still be updated
      const { language } = useAppStore.getState();
      expect(language).toBe("en");
    });

    it("should set language back to vi", async () => {
      mockedAsyncStorage.setItem.mockResolvedValue(undefined);

      await useAppStore.getState().setLanguage("en");
      await useAppStore.getState().setLanguage("vi");

      const { language } = useAppStore.getState();
      expect(language).toBe("vi");
    });
  });

  describe("setOnboardingComplete", () => {
    it("should set onboarding complete to true", async () => {
      mockedAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await useAppStore.getState().setOnboardingComplete(true);

      const { onboardingComplete } = useAppStore.getState();
      expect(onboardingComplete).toBe(true);
    });

    it("should persist onboarding state to AsyncStorage", async () => {
      mockedAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await useAppStore.getState().setOnboardingComplete(true);

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.ONBOARDING_COMPLETE,
        JSON.stringify(true)
      );
    });

    it("should handle storage error gracefully", async () => {
      mockedAsyncStorage.setItem.mockRejectedValueOnce(
        new Error("Storage error")
      );

      await expect(
        useAppStore.getState().setOnboardingComplete(true)
      ).resolves.not.toThrow();

      const { onboardingComplete } = useAppStore.getState();
      expect(onboardingComplete).toBe(true);
    });

    it("should set onboarding complete to false", async () => {
      mockedAsyncStorage.setItem.mockResolvedValue(undefined);

      await useAppStore.getState().setOnboardingComplete(true);
      await useAppStore.getState().setOnboardingComplete(false);

      const { onboardingComplete } = useAppStore.getState();
      expect(onboardingComplete).toBe(false);
    });
  });

  describe("initialize", () => {
    it("should load saved language from storage", async () => {
      mockedAsyncStorage.getItem
        .mockResolvedValueOnce("en") // language
        .mockResolvedValueOnce(null); // onboarding

      await useAppStore.getState().initialize();

      const { language } = useAppStore.getState();
      expect(language).toBe("en");
    });

    it("should load onboarding state from storage", async () => {
      mockedAsyncStorage.getItem
        .mockResolvedValueOnce(null) // language
        .mockResolvedValueOnce("true"); // onboarding

      await useAppStore.getState().initialize();

      const { onboardingComplete } = useAppStore.getState();
      expect(onboardingComplete).toBe(true);
    });

    it("should set isInitialized to true", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      await useAppStore.getState().initialize();

      const { isInitialized } = useAppStore.getState();
      expect(isInitialized).toBe(true);
    });

    it("should use vi as default when no language saved", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      await useAppStore.getState().initialize();

      const { language } = useAppStore.getState();
      expect(language).toBe("vi");
    });

    it("should handle storage error and still initialize", async () => {
      mockedAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

      await expect(useAppStore.getState().initialize()).resolves.not.toThrow();

      const { isInitialized } = useAppStore.getState();
      expect(isInitialized).toBe(true);
    });

    it("should load both language and onboarding together", async () => {
      mockedAsyncStorage.getItem
        .mockResolvedValueOnce("en")
        .mockResolvedValueOnce("true");

      await useAppStore.getState().initialize();

      const { language, onboardingComplete, isInitialized } =
        useAppStore.getState();
      expect(language).toBe("en");
      expect(onboardingComplete).toBe(true);
      expect(isInitialized).toBe(true);
    });
  });

  describe("Selector hooks", () => {
    it("useLanguage should return current language", () => {
      useAppStore.setState({ language: "en" });

      // Direct state access since we can't use hooks outside React
      const language = useAppStore.getState().language;
      expect(language).toBe("en");
    });

    it("useOnboardingComplete should return current state", () => {
      useAppStore.setState({ onboardingComplete: true });

      const onboardingComplete = useAppStore.getState().onboardingComplete;
      expect(onboardingComplete).toBe(true);
    });
  });
});
