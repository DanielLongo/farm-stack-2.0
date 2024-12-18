import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";
import { initializeFirebase, auth } from "../config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [initializing, setInitializing] = useState(true);
  const [biometricAuthenticated, setBiometricAuthenticated] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setIsAuthenticated(!!user);
      if (initializing) setInitializing(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && !biometricAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/biometric_login");
    } else if (isAuthenticated && biometricAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, initializing, router, biometricAuthenticated]);
}

export default function RootLayout() {
  useEffect(() => {
    initializeFirebase();
  }, []);

  useProtectedRoute();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
