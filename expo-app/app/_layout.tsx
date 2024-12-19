import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";
import { initializeFirebase, auth } from "../config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useBiometricLogin } from "../hooks/useBiometricLogin";

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] =
    useState<boolean>(false);
  const [initializing, setInitializing] = useState(true);
  const {
    isAuthenticated: isBiometricAuthenticated,
    loading: biometricLoading,
  } = useBiometricLogin();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setIsFirebaseAuthenticated(!!user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    console.log(
      "useProtectedRoute: isBiometricAuthenticated",
      isBiometricAuthenticated
    );
  }, [isBiometricAuthenticated]);

  useEffect(() => {
    console.log("useProtectedRoute: initializing", initializing);
    console.log("useProtectedRoute: biometricLoading", biometricLoading);
    console.log(
      "useProtectedRoute: isFirebaseAuthenticated",
      isFirebaseAuthenticated
    );
    console.log(
      "useProtectedRoute: isBiometricAuthenticated",
      isBiometricAuthenticated
    );
    if (initializing || biometricLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isFirebaseAuthenticated) {
      !inAuthGroup && router.replace("/(auth)/login");
    } else if (!isBiometricAuthenticated) {
      !inAuthGroup && router.replace("/(auth)/biometric_login");
    } else {
      inAuthGroup && router.replace("/(tabs)");
    }
  }, [
    isFirebaseAuthenticated,
    isBiometricAuthenticated,
    segments,
    initializing,
    biometricLoading,
    router,
  ]);
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
