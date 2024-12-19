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

function RootLayoutContent() {
  const segments = useSegments();
  const router = useRouter();
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] =
    useState<boolean>(false);
  const [initializing, setInitializing] = useState(true);
  const { biometricToken } = useBiometricToken();
  console.log("biometricToken", biometricToken);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setIsFirebaseAuthenticated(!!user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    const isBiometricAuthenticated = biometricToken !== null;
    console.log("isBiometricAuthenticated", isBiometricAuthenticated);
    console.log("isFirebaseAuthenticated", isFirebaseAuthenticated);
    // if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isFirebaseAuthenticated) {
      console.log("replacing with login");
      !inAuthGroup && router.replace("/(auth)/login");
    } else if (!isBiometricAuthenticated) {
      console.log("replacing with biometric_login");
      router.replace("/(auth)/biometric_login");
    } else {
      console.log("replacing with tabs");
      inAuthGroup && router.replace("/(tabs)");
    }
  }, [isFirebaseAuthenticated, biometricToken, segments, initializing, router]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
