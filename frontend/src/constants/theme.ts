/**
 * BarberQueue Theme Constants
 * Core design tokens for the application
 */

export const colors = {
  // Primary Brand
  primary: "#FF6B35",
  primaryDark: "#E85A2A",
  primaryLight: "#FFF3E6",
  secondary: "#F7931E",
  secondaryDark: "#D97D0D",
  dark: "#1A1A1A",

  // Semantic
  coral: "#F26B5B",
  success: "#4CAF50",
  successLight: "#E8F5E9",
  info: "#2196F3",
  warning: "#FFC107",
  warningLight: "#FFF8E1",
  error: "#F44336",
  errorLight: "#FFEBEE",

  // Text
  textPrimary: "#1A1A1A",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  textInverse: "#FFFFFF",

  // Backgrounds
  backgroundPrimary: "#FFFFFF",
  backgroundSecondary: "#F5F5F5",
  backgroundTertiary: "#FFF3E6",

  // Borders
  borderLight: "#E5E7EB",
  borderMedium: "#D1D5DB",

  // Special
  favorite: "#FF6B6B",
  rating: "#FFD700",
} as const;

export const fonts = {
  light: "Montserrat-Light",
  regular: "Montserrat-Regular",
  medium: "Montserrat-Medium",
  semibold: "Montserrat-SemiBold",
  bold: "Montserrat-Bold",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  full: 9999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
} as const;

// Gradient presets for LinearGradient
export const gradients = {
  primary: ["#FF6B35", "#F7931E"] as const,
  background: ["#FFFFFF", "#FFF3E6"] as const,
  darkOverlay: ["transparent", "rgba(26, 26, 26, 0.8)"] as const,
};
