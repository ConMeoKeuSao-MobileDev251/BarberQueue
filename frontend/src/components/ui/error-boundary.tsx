/**
 * Error Boundary Component
 * Catches JavaScript errors in child components
 */
import React, { Component, ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 items-center justify-center px-8 py-12 bg-background-secondary">
          <View className="w-20 h-20 rounded-full bg-error-light items-center justify-center mb-4">
            <Ionicons name="alert-circle" size={40} color={colors.error} />
          </View>
          <Text className="text-text-primary text-lg font-montserrat-semibold text-center mb-2">
            Đã xảy ra lỗi
          </Text>
          <Text className="text-text-secondary text-sm font-montserrat-regular text-center mb-6">
            Ứng dụng gặp sự cố. Vui lòng thử lại.
          </Text>
          <Pressable
            onPress={this.handleRetry}
            className="px-6 py-3 bg-primary rounded-lg active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Thử lại"
          >
            <Text className="text-white font-montserrat-medium">Thử lại</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * Network Error Component
 * Display when network request fails
 */
interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

export function NetworkError({
  onRetry,
  message = "Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.",
}: NetworkErrorProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="w-20 h-20 rounded-full bg-warning-light items-center justify-center mb-4">
        <Ionicons name="wifi-outline" size={40} color={colors.warning} />
      </View>
      <Text className="text-text-primary text-lg font-montserrat-semibold text-center mb-2">
        Lỗi kết nối
      </Text>
      <Text className="text-text-secondary text-sm font-montserrat-regular text-center mb-6">
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="px-6 py-3 bg-primary rounded-lg active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Thử lại"
        >
          <Text className="text-white font-montserrat-medium">Thử lại</Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * API Error Component
 * Display API error with optional details
 */
interface ApiErrorProps {
  message?: string;
  code?: string | number;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export function ApiError({
  message = "Đã xảy ra lỗi. Vui lòng thử lại sau.",
  code,
  onRetry,
  onGoBack,
}: ApiErrorProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="w-20 h-20 rounded-full bg-error-light items-center justify-center mb-4">
        <Ionicons name="cloud-offline-outline" size={40} color={colors.error} />
      </View>
      <Text className="text-text-primary text-lg font-montserrat-semibold text-center mb-2">
        Không thể tải dữ liệu
      </Text>
      <Text className="text-text-secondary text-sm font-montserrat-regular text-center mb-2">
        {message}
      </Text>
      {code && (
        <Text className="text-text-tertiary text-xs font-montserrat-regular mb-6">
          Mã lỗi: {code}
        </Text>
      )}
      <View className="flex-row gap-3">
        {onGoBack && (
          <Pressable
            onPress={onGoBack}
            className="px-6 py-3 border border-border-light rounded-lg active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Text className="text-text-primary font-montserrat-medium">Quay lại</Text>
          </Pressable>
        )}
        {onRetry && (
          <Pressable
            onPress={onRetry}
            className="px-6 py-3 bg-primary rounded-lg active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Thử lại"
          >
            <Text className="text-white font-montserrat-medium">Thử lại</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
