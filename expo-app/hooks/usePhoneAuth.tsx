import { useState } from "react";
import { useRouter } from "expo-router";

// Replace with your actual API endpoint
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.yourbackend.com";

export function usePhoneAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const sendVerificationCode = async (phoneNumber: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }

      // Navigate to verification screen with phone number
      router.push({
        pathname: "/(auth)/confirm_phone_number",
        params: { phoneNumber },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (phoneNumber: string, code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify code");
      }

      // Store the auth token
      // You might want to use a secure storage solution here
      // await SecureStore.setItemAsync("authToken", data.token);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendVerificationCode,
    verifyCode,
  };
}
