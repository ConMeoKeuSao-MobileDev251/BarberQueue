/**
 * Safe Area Wrapper Component
 * Consistent safe area handling across screens
 */
import { View } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { ReactNode } from "react";

interface SafeAreaWrapperProps {
  children: ReactNode;
  edges?: Edge[];
  className?: string;
  backgroundColor?: string;
}

export function SafeAreaWrapper({
  children,
  edges = ["top", "bottom"],
  className = "",
  backgroundColor = "#FFFFFF",
}: SafeAreaWrapperProps) {
  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 ${className}`}
      style={{ backgroundColor }}
    >
      {children}
    </SafeAreaView>
  );
}

/**
 * Screen Container - Full screen with optional padding
 */
interface ScreenContainerProps {
  children: ReactNode;
  noPadding?: boolean;
  className?: string;
}

export function ScreenContainer({
  children,
  noPadding = false,
  className = "",
}: ScreenContainerProps) {
  return (
    <View className={`flex-1 bg-background-primary ${noPadding ? "" : "px-4"} ${className}`}>
      {children}
    </View>
  );
}

/**
 * Content Section - Grouped content with optional title
 */
interface SectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className = "" }: SectionProps) {
  return (
    <View className={`mb-6 ${className}`}>
      {title && (
        <View className="text-text-primary text-lg font-montserrat-semibold mb-3">
          {title}
        </View>
      )}
      {children}
    </View>
  );
}
