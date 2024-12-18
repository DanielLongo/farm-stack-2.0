import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="confirm_phone_number"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
