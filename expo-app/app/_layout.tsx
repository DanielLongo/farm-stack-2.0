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
  const { hasShownOnboarding, loadOnboardingState } = useOnboarding();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setIsFirebaseAuthenticated(!!user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    const isBiometricAuthenticated = biometricToken !== null;

    if (!hasShownOnboarding) {
      // make sure we load the onboarding state
      loadOnboardingState();
    }
    const needsOnboarding = !hasShownOnboarding;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    console.log("is in auth group", inAuthGroup);
    console.log("is in onboarding group", inOnboardingGroup);
    console.log("needs onboarding", needsOnboarding);

    if (initializing) return;

    if (!isFirebaseAuthenticated) {
      if (!inAuthGroup && !inOnboardingGroup) {
        router.replace("/(auth)/login");
      }
    } else if (!isBiometricAuthenticated) {
      if (!inAuthGroup) {
        router.replace("/(auth)/biometric_login");
      }
    } else if (needsOnboarding) {
      if (!inOnboardingGroup) {
        router.replace("/(onboarding)/overview");
      }
    } else {
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
