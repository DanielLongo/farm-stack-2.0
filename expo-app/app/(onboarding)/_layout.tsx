import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="overview" options={{ headerShown: false }} />
      <Stack.Screen name="security" options={{ headerShown: false }} />
    </Stack>
  );
}
