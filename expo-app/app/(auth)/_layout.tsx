import { Tabs } from "expo-router";

export default function AuthLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
        },
      }}
    >
      <Tabs.Screen
        name="login"
        options={{
          tabBarLabel: "Login",
        }}
      />
      <Tabs.Screen
        name="confirm_phone_number"
        options={{
          tabBarLabel: "Verify",
        }}
      />
      <Tabs.Screen
        name="biometric_login"
        options={{
          tabBarLabel: "Biometric",
        }}
      />
    </Tabs>
  );
}
