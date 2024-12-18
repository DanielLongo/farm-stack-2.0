import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function Recording() {
  const router = useRouter();
  const [transcript, setTranscript] = useState<string>("");
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base text-gray-600">{timestamp}</Text>
        <View className="w-10" /> {/* Placeholder for symmetry */}
      </View>

      {/* Transcript Area */}
      <ScrollView className="flex-1 p-4">
        {transcript ? (
          <Text className="text-lg text-gray-800">{transcript}</Text>
        ) : (
          <Text className="text-lg text-gray-500 italic text-center">
            Recording will appear here...
          </Text>
        )}
      </ScrollView>

      {/* Recording Controls */}
      <View className="p-4 bg-white">
        <TouchableOpacity className="w-16 h-16 bg-red-500 rounded-full items-center justify-center self-center">
          <Ionicons name="mic" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
