/**
 * Haptic Feedback Utilities
 * Provides tactile feedback for user interactions
 */
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Light haptic feedback - for selections, toggles
 */
export async function lightHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics not available on this device
  }
}

/**
 * Medium haptic feedback - for button presses, actions
 */
export async function mediumHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Haptics not available
  }
}

/**
 * Heavy haptic feedback - for important actions, confirmations
 */
export async function heavyHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {
    // Haptics not available
  }
}

/**
 * Success haptic feedback - for successful operations
 */
export async function successHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics not available
  }
}

/**
 * Warning haptic feedback - for warnings, alerts
 */
export async function warningHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // Haptics not available
  }
}

/**
 * Error haptic feedback - for errors, failures
 */
export async function errorHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // Haptics not available
  }
}

/**
 * Selection haptic feedback - for list selections, tab changes
 */
export async function selectionHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics not available
  }
}
