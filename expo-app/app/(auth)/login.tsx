import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { signInWithPhoneNumber, PhoneAuthProvider } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { useRouter } from "expo-router";
import { auth } from "../../config/firebase";
import { ApplicationVerifier } from "firebase/auth";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const handleContinue = async () => {
    if (phoneNumber) {
      try {
        setLoading(true);
        setError(null);

        const formattedNumber = phoneNumber.startsWith("+")
          ? phoneNumber
          : `+1${phoneNumber.replace(/\D/g, "")}`;

        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
          formattedNumber,
          recaptchaVerifier.current as unknown as ApplicationVerifier
        );

        router.push({
          pathname: "/(auth)/confirm_phone_number",
          params: { verificationId },
        });
      } catch (err: any) {
        setError(err?.message ?? "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-amber-50 p-6">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification={true}
        title="Prove you're human!"
        cancelLabel="Close"
      />
      <Text className="text-2xl font-bold mb-8">Login or Sign Up</Text>

      <View className="w-full">
        {error && (
          <Text className="text-red-500 mb-4 text-center">{error}</Text>
        )}

        <TextInput
          className="w-full bg-white p-4 rounded-lg border border-gray-300 mb-4"
          placeholder="(650) 555-1234"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
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
