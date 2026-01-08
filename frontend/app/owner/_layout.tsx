/**
 * Owner Non-Tab Screens Layout
 * Stack navigation for create/edit screens
 */
import { Stack } from "expo-router";

export default function OwnerStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="staff" />
      <Stack.Screen name="branch" />
      <Stack.Screen name="service" />
      <Stack.Screen name="address" />
    </Stack>
  );
}
