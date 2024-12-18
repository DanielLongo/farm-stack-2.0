import {
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { usePhoneAuth } from "../../hooks/usePhoneAuth";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { loading, error, sendVerificationCode } = usePhoneAuth();

  const handleContinue = () => {
    if (phoneNumber) {
      sendVerificationCode(phoneNumber);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-amber-50 p-6">
      <Text className="text-2xl font-bold mb-8">Login or Sign Up</Text>

      <View className="w-full">
        {error && (
          <Text className="text-red-500 mb-4 text-center">{error}</Text>
        )}

        <TextInput
          className="w-full bg-white p-4 rounded-lg border border-gray-300 mb-4"
          placeholder="(650) 555-1234"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={!loading}
        />

        <Pressable
          className={`${
            loading ? "bg-blue-400" : "bg-blue-500"
          } p-4 rounded-lg mb-4`}
          onPress={handleContinue}
          disabled={loading || !phoneNumber}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Continue
            </Text>
          )}
        </Pressable>

        <Text className="text-center text-gray-600 text-sm px-4">
          By entering your phone number, you agree to our{" "}
          <Text className="text-blue-500">Terms of Service</Text> and{" "}
          <Text className="text-blue-500">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}
