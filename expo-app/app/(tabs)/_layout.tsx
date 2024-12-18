import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
        }}
      />
      <Tabs.Screen
        name="recording"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
