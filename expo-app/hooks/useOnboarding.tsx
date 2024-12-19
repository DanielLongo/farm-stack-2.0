import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";

const ONBOARDING_KEY = "@onboarding_status1";
const ONBOARDING_COMPLETED_KEY = "@onboarding_completed1";

export type OnboardingScreen =
  | "overview"
  | "security"
  | "permissions"
  | "complete";

interface OnboardingState {
  hasShownOnboarding: boolean;
  currentScreen: OnboardingScreen;
}

export function useOnboarding() {
  const pathname = usePathname();
  const [state, setState] = useState<OnboardingState>({
    hasShownOnboarding: false,
    currentScreen: "overview",
  });

  // Load onboarding state on mount
  useEffect(() => {
    loadOnboardingState();
  }, []);

  useEffect(() => {
    if (state.currentScreen === "complete") {
      completeOnboarding();
    } else {
      // Check if current path doesn't match current screen
      //   if (!pathname.includes(state.currentScreen)) {
      //     router.replace(`/(onboarding)/${state.currentScreen}`);
      //   }
    }
  }, [state.currentScreen, pathname]);

  const loadOnboardingState = async () => {
    try {
      const status = await AsyncStorage.getItem(ONBOARDING_KEY);
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);

      if (status) {
        setState(JSON.parse(status));
      }
    } catch (error) {
      console.error("Error loading onboarding state:", error);
    }
  };

  const setCurrentScreen = async (screen: OnboardingScreen) => {
    const newState = {
      ...state,
      currentScreen: screen,
    };

    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.error("Error saving onboarding screen:", error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
      setState({
        hasShownOnboarding: true,
        currentScreen: "overview",
      });
      router.replace("/(auth)/login");
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
      setState({
        hasShownOnboarding: false,
        currentScreen: "overview",
      });
      router.replace("/(onboarding)/overview");
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  };

  return {
    currentScreen: state.currentScreen,
    hasShownOnboarding: state.hasShownOnboarding,
    setCurrentScreen,
    completeOnboarding,
    resetOnboarding,
  };
}
