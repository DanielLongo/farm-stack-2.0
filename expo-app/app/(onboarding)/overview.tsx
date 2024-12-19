import { Text, View, SafeAreaView, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOnboarding } from "../../hooks/useOnboarding";

export default function Overview() {
  const { setCurrentScreen } = useOnboarding();

  const features = [
    {
      title: "Record & Transcribe",
      description:
        "Capture your thoughts with voice recordings that automatically convert to text",
      icon: "mic-outline",
    },
    {
      title: "Secure Storage",
      description:
        "Your entries are encrypted and stored safely on your device",
      icon: "lock-closed-outline",
    },
    {
      title: "Easy Organization",
      description:
        "Sort and filter your entries by date, tags, or custom categories",
      icon: "folder-outline",
    },
    {
      title: "Quick Search",
      description: "Find any entry instantly with powerful search capabilities",
      icon: "search-outline",
    },
  ];
  console.log("overview");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="py-8">
          <Text className="text-3xl font-bold text-gray-900 mb-4 text-center mt-10">
            Welcome to [App Name]
          </Text>
          <Text className="text-lg text-gray-600 mb-8">
            Your personal voice journal that keeps your thoughts organized and
            secure
          </Text>
        </View>

        <View className="space-y-6 mb-8">
          {features.map((feature, index) => (
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
            console.log("Continue pressed");
            setCurrentScreen("security");
          }}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Continue
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
