import { usePathname } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <View className="flex-1 justify-center items-center bg-amber-50">
      <Text className="text-2xl font-semibold mb-4">Page Not Found</Text>
      <Text className="text-gray-600 text-center">
        Route not found: {usePathname()}
      </Text>
    </View>
  );
}
