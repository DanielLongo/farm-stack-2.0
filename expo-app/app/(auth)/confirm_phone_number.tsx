import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { usePhoneAuth } from "../../hooks/usePhoneAuth";

export default function ConfirmPhoneNumber() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [code, setCode] = useState("");
  const { loading, error, verifyCode } = usePhoneAuth();

  const handleVerify = () => {
    if (code.length === 6 && phoneNumber) {
      verifyCode(phoneNumber, code);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-amber-50 p-4">
      <Text className="text-2xl font-semibold mb-6">Verify Your Phone</Text>

      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}

      <Text className="text-gray-600 mb-6 text-center">
        Enter the 6-digit code we sent to {phoneNumber}
      </Text>

      <TextInput
        className="w-64 h-12 bg-white border border-gray-300 rounded-lg text-center text-lg mb-6"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="000000"
        editable={!loading}
      />

      <TouchableOpacity
        className={`w-64 h-12 rounded-lg justify-center items-center ${
          code.length === 6
            ? loading
              ? "bg-blue-400"
              : "bg-blue-500"
            : "bg-gray-300"
        }`}
        onPress={handleVerify}
        disabled={code.length !== 6 || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
