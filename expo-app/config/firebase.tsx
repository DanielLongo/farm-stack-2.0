import { initializeApp, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
const config = {
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_GOOGLE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_GOOGLE_PROJECT_ID!,
} as const;

export const initializeFirebase = () => {
  try {
    // Add these minimal required fields for Firebase Auth only
    const minimalConfig = {
      ...config,
      // Add these dummy values since we're only using Auth
      databaseURL: "unused",
      storageBucket: "unused",
      messagingSenderId: "000000000000",
      // This is required but can be any string when only using Auth
      appId: "1:000000000000:web:0000000000000000000000",
    };

    // Check if Firebase is already initialized
    try {
      return getApp();
    } catch {
      // If not initialized, initialize it
      const app = initializeApp(minimalConfig);

      // Initialize Auth with persistence

      return app;
    }
  } catch (error: any) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
};

export const firebaseConfig = config;

export const auth = initializeAuth(initializeFirebase(), {
  persistence: getReactNativePersistence(AsyncStorage),
});

// export const auth = getAuth(initializeFirebase());
