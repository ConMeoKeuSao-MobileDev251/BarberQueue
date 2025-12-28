import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <Text className="text-3xl font-bold text-white mb-4">
        Hello NativeWind! 🚀
      </Text>
      <View className="bg-blue-500 px-6 py-3 rounded-full active:bg-blue-600">
        <Text className="text-white font-medium">Test Button</Text>
      </View>
    </View>
  );
}
