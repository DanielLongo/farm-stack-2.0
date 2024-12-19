import { router, Stack, usePathname } from "expo-router";

export default function OnboardingLayout() {
  const currentPath = usePathname();
  console.log("CURRENT PATH", currentPath);
  return (
    <Stack>
      <Stack.Screen name="overview" options={{ headerShown: false }} />
      <Stack.Screen name="security" options={{ headerShown: false }} />
    </Stack>
  );
}
