/**
 * Haptics Tests
 * Tests for haptic feedback utilities
 */
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import {
  lightHaptic,
  mediumHaptic,
  heavyHaptic,
  successHaptic,
  warningHaptic,
  errorHaptic,
  selectionHaptic,
} from "../haptics";

// Mocks are already set up in jest.setup.js
const mockedHaptics = Haptics as jest.Mocked<typeof Haptics>;

describe("Haptics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS mock to ios for each test
    (Platform as { OS: string }).OS = "ios";
  });

  describe("lightHaptic", () => {
    it("should call impactAsync with Light style", async () => {
      await lightHaptic();

      expect(mockedHaptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it("should not call impactAsync on web", async () => {
      (Platform as { OS: string }).OS = "web";

      await lightHaptic();

      expect(mockedHaptics.impactAsync).not.toHaveBeenCalled();
    });

    it("should handle haptics error gracefully", async () => {
      mockedHaptics.impactAsync.mockRejectedValueOnce(
        new Error("Haptics not available")
      );

      // Should not throw
      await expect(lightHaptic()).resolves.not.toThrow();
    });
  });

  describe("mediumHaptic", () => {
    it("should call impactAsync with Medium style", async () => {
      await mediumHaptic();

      expect(mockedHaptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it("should not call impactAsync on web", async () => {
      (Platform as { OS: string }).OS = "web";

      await mediumHaptic();

      expect(mockedHaptics.impactAsync).not.toHaveBeenCalled();
    });

    it("should handle haptics error gracefully", async () => {
      mockedHaptics.impactAsync.mockRejectedValueOnce(
        new Error("Haptics not available")
      );

      await expect(mediumHaptic()).resolves.not.toThrow();
    });
  });

  describe("heavyHaptic", () => {
    it("should call impactAsync with Heavy style", async () => {
      await heavyHaptic();

      expect(mockedHaptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Heavy
      );
    });

    it("should not call impactAsync on web", async () => {
      (Platform as { OS: string }).OS = "web";

      await heavyHaptic();

      expect(mockedHaptics.impactAsync).not.toHaveBeenCalled();
    });

    it("should handle haptics error gracefully", async () => {
      mockedHaptics.impactAsync.mockRejectedValueOnce(
        new Error("Haptics not available")
      );

      await expect(heavyHaptic()).resolves.not.toThrow();
    });
  });

  describe("successHaptic", () => {
    it("should call notificationAsync with Success type", async () => {
      await successHaptic();

      expect(mockedHaptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success
      );
    });

    it("should not call notificationAsync on web", async () => {
      (Platform as { OS: string }).OS = "web";

      await successHaptic();

      expect(mockedHaptics.notificationAsync).not.toHaveBeenCalled();
    });

    it("should handle haptics error gracefully", async () => {
      mockedHaptics.notificationAsync.mockRejectedValueOnce(
        new Error("Haptics not available")
      );

      await expect(successHaptic()).resolves.not.toThrow();
    });
  });

  describe("warningHaptic", () => {
    it("should call notificationAsync with Warning type", async () => {
      await warningHaptic();

      expect(mockedHaptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Warning
      );
    });

    it("should not call notificationAsync on web", async () => {
      (Platform as { OS: string }).OS = "web";

      await warningHaptic();

      expect(mockedHaptics.notificationAsync).not.toHaveBeenCalled();
    });

    it("should handle haptics error gracefully", async () => {
      mockedHaptics.notificationAsync.mockRejectedValueOnce(
        new Error("Haptics not available")
      );

      await expect(warningHaptic()).resolves.not.toThrow();
    });
  });

  describe("errorHaptic", () => {
    it("should call notificationAsync with Error type", async () => {
      await errorHaptic();

      expect(mockedHaptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Error
      );
    });

    it("should not call notificationAsync on web", async () => {
      (Platform as { OS: string }).OS = "web";

      await errorHaptic();

      expect(mockedHaptics.notificationAsync).not.toHaveBeenCalled();
    });

    it("should handle haptics error gracefully", async () => {
      mockedHaptics.notificationAsync.mockRejectedValueOnce(
        new Error("Haptics not available")
      );

      await expect(errorHaptic()).resolves.not.toThrow();
    });
  });

  describe("selectionHaptic", () => {
    it("should call selectionAsync", async () => {
      await selectionHaptic();

      expect(mockedHaptics.selectionAsync).toHaveBeenCalled();
    });

    it("should not call selectionAsync on web", async () => {
      (Platform as { OS: string }).OS = "web";

      await selectionHaptic();

      expect(mockedHaptics.selectionAsync).not.toHaveBeenCalled();
    });

    it("should handle haptics error gracefully", async () => {
      mockedHaptics.selectionAsync.mockRejectedValueOnce(
        new Error("Haptics not available")
      );

      await expect(selectionHaptic()).resolves.not.toThrow();
    });
  });

  describe("Platform behavior", () => {
    it("should work on iOS", async () => {
      (Platform as { OS: string }).OS = "ios";

      await lightHaptic();

      expect(mockedHaptics.impactAsync).toHaveBeenCalled();
    });

    it("should work on Android", async () => {
      (Platform as { OS: string }).OS = "android";

      await lightHaptic();

      expect(mockedHaptics.impactAsync).toHaveBeenCalled();
    });

    it("should skip on web platform", async () => {
      (Platform as { OS: string }).OS = "web";

      await lightHaptic();
      await mediumHaptic();
      await heavyHaptic();
      await successHaptic();
      await warningHaptic();
      await errorHaptic();
      await selectionHaptic();

      expect(mockedHaptics.impactAsync).not.toHaveBeenCalled();
      expect(mockedHaptics.notificationAsync).not.toHaveBeenCalled();
      expect(mockedHaptics.selectionAsync).not.toHaveBeenCalled();
    });
  });
});
