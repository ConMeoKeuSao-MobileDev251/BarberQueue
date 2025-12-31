/**
 * Checkout Layout
 */
import { Stack } from "expo-router";

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="stylist" />
      <Stack.Screen name="datetime" />
      <Stack.Screen name="promos" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
