import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../config/firebase";

export default function ConfirmPhoneNumber() {
  const { verificationId } = useLocalSearchParams<{ verificationId: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleVerify = async () => {
    if (code.length === 6 && verificationId) {
      try {
        setLoading(true);
        setError(null);

        // Create credential
        const credential = PhoneAuthProvider.credential(verificationId, code);

        // Sign in with credential
        await signInWithCredential(auth, credential);

        // Navigate to main app on success
        router.replace("/(tabs)");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Invalid verification code"
        );
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter a valid 6-digit code");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-amber-50 p-4">
      <Text className="text-2xl font-semibold mb-6">Verify Your Phone</Text>

      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}

      <Text className="text-gray-600 mb-6 text-center">
        Enter the 6-digit code we sent to your phone
      </Text>

      <TextInput
        className="w-64 h-12 bg-white border border-gray-300 rounded-lg text-center text-lg mb-6"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="000000"
        editable={!loading}
        returnKeyType="done"
        blurOnSubmit={true}
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
