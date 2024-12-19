import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";
import { useBiometricLogin } from "../../hooks/useBiometricLogin";

export default function BiometricLogin() {
  const { authenticate, loading, error, biometricType } = useBiometricLogin();

  const handleAuthenticate = async () => {
    await authenticate();
  };

  return (
    <View className="flex-1 justify-center items-center bg-amber-50 p-6">
      <View className="items-center mb-8">
        <Ionicons
          name={
            biometricType.includes("Face ID")
              ? "face-recognition"
              : biometricType.includes("Fingerprint")
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
          loading ? "bg-blue-400" : "bg-blue-500"
        } p-4 rounded-lg mb-4`}
        onPress={handleAuthenticate}
        disabled={loading}
      >
        {loading ? (
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
