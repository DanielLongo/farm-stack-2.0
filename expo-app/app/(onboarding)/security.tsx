import { Text, View, SafeAreaView, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOnboarding } from "../../hooks/useOnboarding";
export default function Security() {
  const { setCurrentScreen } = useOnboarding();
  const securityFeatures = [
    {
      title: "On Device",
      description:
        "All data is stored on device only. We'll never store it on the cloud.",
      icon: "lock-closed-outline",
    },
    {
      title: "Encryption",
      description:
        "All data that is passed through AI is de-identified and encrypted.",
      icon: "lock-closed-outline",
    },
    {
      title: "Biometric",
      description:
        "Biometric verification required at every login to ensure you're the only one with access.",
      icon: "lock-closed-outline",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="py-8">
          <Text className="text-3xl font-bold text-gray-900 mb-4 text-center mt-10">
            Security Features
          </Text>
          <Text className="text-lg text-gray-600 mb-8">
            Your data is safe with us. Here’s how we protect your information:
          </Text>
        </View>

        <View className="space-y-6 mb-8">
          {securityFeatures.map((feature, index) => (
            <View
              key={index}
              className="flex-row items-start space-x-4 bg-gray-50 p-4 rounded-xl"
            >
              <View className="bg-blue-100 p-4 rounded-full m-4 mt-2">
                <Ionicons
                  name={feature.icon as any}
                  size={24}
                  color="#3B82F6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  {feature.title}
                </Text>
                <Text className="text-gray-600">{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          className="bg-blue-500 py-4 px-6 rounded-xl mb-8"
          onPress={() => {
            // Add navigation logic here
            setCurrentScreen("complete");
          }}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Get Started
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
