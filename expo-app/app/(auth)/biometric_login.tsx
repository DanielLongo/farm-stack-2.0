import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";

export default function BiometricLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricType, setBiometricType] = useState<string>("Biometrics");
  const router = useRouter();

  useEffect(() => {
    console.log("BiometricLogin: Component mounted.");
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    console.log("BiometricLogin: Starting biometric check.");
    try {
      console.log("BiometricLogin: Checking for biometric hardware...");
      const compatible = await LocalAuthentication.hasHardwareAsync();
      console.log(`BiometricLogin: Hardware compatible: ${compatible}`);

      console.log("BiometricLogin: Checking if biometrics are enrolled...");
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      console.log(`BiometricLogin: Biometrics enrolled: ${enrolled}`);

      if (compatible && enrolled) {
        console.log(
          "BiometricLogin: Retrieving supported authentication types..."
        );
        const typesBitmask =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        console.log(`BiometricLogin: Supported types bitmask: ${typesBitmask}`);

        const supportedTypes: string[] = [];
        if (
          typesBitmask.includes(
            LocalAuthentication.AuthenticationType.FINGERPRINT
          )
        ) {
          supportedTypes.push("Fingerprint");
        }
        if (
          typesBitmask.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          supportedTypes.push("Face ID");
        }
        if (
          typesBitmask.includes(LocalAuthentication.AuthenticationType.IRIS)
        ) {
          supportedTypes.push("Iris");
        }
        if (
          typesBitmask.includes(LocalAuthentication.AuthenticationType.PASSCODE)
        ) {
          supportedTypes.push("Passcode");
        }

        console.log(`BiometricLogin: Supported types: ${supportedTypes}`);

        if (supportedTypes.length > 0) {
          setBiometricType(supportedTypes.join(", "));
          console.log(
            `BiometricLogin: Supported biometric types: ${supportedTypes.join(
              ", "
            )}.`
          );
        } else {
          setBiometricType("Biometrics");
          console.log("BiometricLogin: Set biometric type to Biometrics.");
        }
      } else {
        setBiometricType("Device Passcode");
        console.log(
          "BiometricLogin: Biometrics unavailable. Falling back to Device Passcode."
        );
      }
    } catch (err) {
      console.error("BiometricLogin: Error during biometric check:", err);
      setError("An error occurred while checking authentication methods.");
    }
  };

  const handleAuthentication = async () => {
    console.log("BiometricLogin: Authentication initiated.");
    try {
      setIsLoading(true);
      setError(null);

      const promptMessage =
        biometricType.includes("Face ID") ||
        biometricType.includes("Touch ID") ||
        biometricType.includes("Biometrics")
          ? `Authenticate with ${biometricType}`
          : "Authenticate with Device Passcode";

      console.log(`BiometricLogin: Prompt message set to "${promptMessage}".`);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage,
        fallbackLabel: "Use device passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      console.log("BiometricLogin: Authentication result:", result);

      if (result.success) {
        console.log(
          "BiometricLogin: Authentication successful. Navigating to /tabs."
        );
        router.replace("/(tabs)");
      } else {
        console.log("BiometricLogin: Authentication failed.");
        setError("Authentication failed. Please try again.");
      }
    } catch (err) {
      console.error("BiometricLogin: Error during authentication:", err);
      setError("An error occurred during authentication.");
    } finally {
      setIsLoading(false);
      console.log(
        "BiometricLogin: Authentication process completed. isLoading set to false."
      );
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-amber-50 p-6">
      <View className="items-center mb-8">
        <Ionicons
          name={
            biometricType === "Face ID"
              ? "face-recognition"
              : biometricType === "Touch ID"
              ? "finger-print"
              : "key"
          }
          size={64}
          color="#4B5563"
        />
      </View>

      <Text className="text-2xl font-bold mb-4 text-center">
        {biometricType.includes("Passcode")
          ? "Use Device Passcode to Unlock"
          : `Use ${biometricType} to Unlock`}
      </Text>

      <Text className="text-gray-600 mb-8 text-center">
        Please authenticate to access your private journal entries.
      </Text>

      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}

      <TouchableOpacity
        className={`w-full ${
          isLoading ? "bg-blue-400" : "bg-blue-500"
        } p-4 rounded-lg mb-4`}
        onPress={handleAuthentication}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">
            {biometricType.includes("Passcode")
              ? "Authenticate with Device Passcode"
              : `Authenticate with ${biometricType}`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
