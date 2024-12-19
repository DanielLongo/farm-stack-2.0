import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";

const ONBOARDING_KEY = "@onboarding_status3";
const ONBOARDING_COMPLETED_KEY = "@onboarding_completed3";

export type OnboardingScreen =
  | "overview"
  | "security"
  | "permissions"
  | "complete";

export function useOnboarding() {
  const pathname = usePathname();
  const [hasShownOnboarding, setHasShownOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] =
    useState<OnboardingScreen>("overview");

  // Load onboarding state on mount
  useEffect(() => {
    loadOnboardingState();
  }, []);

  useEffect(() => {
    if (currentScreen === "complete") {
      completeOnboarding();
    }
  }, [currentScreen, pathname]);

  const loadOnboardingState = async () => {
    try {
      const status = await AsyncStorage.getItem(ONBOARDING_KEY);
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);

      if (status) {
        const newState = JSON.parse(status);
        setHasShownOnboarding(newState.hasShownOnboarding);
        setCurrentScreen(newState.currentScreen);
      }

      if (completed === "true") {
        setHasShownOnboarding(true);
      }
    } catch (error) {
      console.error("Error loading onboarding state:", error);
    }
  };

  const setCurrentScreenHandler = async (screen: OnboardingScreen) => {
    setCurrentScreen(screen);
    if (screen === "overview" || screen === "security") {
      router.replace(`/(onboarding)/${screen}`);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
      setHasShownOnboarding(true);
      setCurrentScreen("complete");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.multiRemove([
        ONBOARDING_KEY,
        ONBOARDING_COMPLETED_KEY,
      ]);
      setHasShownOnboarding(false);
      setCurrentScreen("overview");
      router.replace("/(onboarding)/overview");
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  };

  return {
    currentScreen,
    hasShownOnboarding,
    setCurrentScreen: setCurrentScreenHandler,
    completeOnboarding,
    resetOnboarding,
    loadOnboardingState,
  };
}
