import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";
import { initializeFirebase, auth } from "../config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useBiometricLogin } from "../hooks/useBiometricLogin";
import {
  BiometricTokenProvider,
  useBiometricToken,
} from "@/config/BiometricTokenContext";
import { useOnboarding } from "../hooks/useOnboarding";

function RootLayoutContent() {
  const segments = useSegments();
  const router = useRouter();
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] =
    useState<boolean>(false);
  const [initializing, setInitializing] = useState(true);
  const { biometricToken } = useBiometricToken();
  const { hasShownOnboarding } = useOnboarding();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setIsFirebaseAuthenticated(!!user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    const isBiometricAuthenticated = biometricToken !== null;
    const needsOnboarding = !hasShownOnboarding;
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (initializing) return;

    if (!isFirebaseAuthenticated) {
      console.log("replacing with login");
      if (!inAuthGroup && !inOnboardingGroup) {
        router.replace("/(auth)/login");
      }
    } else if (!isBiometricAuthenticated) {
      console.log("replacing with biometric_login");
      router.replace("/(auth)/biometric_login");
    } else if (needsOnboarding) {
      console.log("replacing with onboarding");
      router.replace("/(onboarding)/overview");
    } else {
      console.log("replacing with tabs");
      if (inAuthGroup || inOnboardingGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [
    isFirebaseAuthenticated,
    biometricToken,
    segments,
    initializing,
    router,
    hasShownOnboarding,
  ]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    initializeFirebase();
  }, []);

  return (
    <BiometricTokenProvider>
      <RootLayoutContent />
    </BiometricTokenProvider>
  );
}
