import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

// Add this function to check authentication
function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();

  // Replace this with your actual auth check
  const isAuthenticated = false; // TODO: Add your auth check here

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if user is not authenticated and not already on auth screen
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, segments]);
}

export default function RootLayout() {
  useProtectedRoute();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
