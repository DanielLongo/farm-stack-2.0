import { Text, View } from "react-native";
import { Link } from "expo-router";
export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-amber-50">
      <Link href="/account">
        <Text>Index</Text>
      </Link>
    </View>
  );
}
