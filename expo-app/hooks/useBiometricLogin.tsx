import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { useBiometricToken } from "../config/BiometricTokenContext";
const BIOMETRIC_AUTH_KEY = "@biometric_authenticated";

export function useBiometricLogin() {
  const { setBiometricToken } = useBiometricToken();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricType, setBiometricType] = useState<string>("Biometrics");

  // Check if device has biometric capabilities
  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!compatible || !enrolled) {
        setBiometricType("Device Passcode");
        return false;
      }

      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const supportedTypes: string[] = [];

      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        supportedTypes.push("Fingerprint");
      }
      if (
        types.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
        )
      ) {
        supportedTypes.push("Face ID");
      }

      if (supportedTypes.length > 0) {
        setBiometricType(supportedTypes.join(", "));
      }

      return true;
    } catch (err) {
      console.error("Error checking biometric availability:", err);
      return false;
    }
  };

  // Authenticate using biometrics
  const authenticate = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate with ${biometricType}`,
        fallbackLabel: "Use device passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        console.log(
          "BiometricLogin: Authentication successful. calling onSuccess"
        );
        setBiometricToken("token");
        return "token";
      } else {
        setError("Authentication failed");
      }
      console.log(
        "BiometricLogin: Authentication result",
        result,
        result.success
      );

      return result.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      return false;
    } finally {
      setLoading(false);
      setBiometricToken("token");
    }
  };

  // Reset authentication state
  const reset = async () => {
    setBiometricToken(null);
  };

  // Check initial authentication state
  useEffect(() => {
    setLoading(false);
  }, []);

  return {
    authenticate,
    loading,
    error,
    biometricType,
    checkBiometricAvailability,
  };
}
