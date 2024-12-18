import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Pressable,
} from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(-10))[0];
  const router = useRouter();

  const recordings = [
    {
      date: "12/17/24",
      duration: "00:01",
    },
    {
      date: "2/26/23",
      duration: "00:08",
      text: "Hello, testing, testing. One, two, three, four. This is a very important meeting.",
    },
  ];

  const showMenu = () => {
    setShowOptions(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -10,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setShowOptions(false));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Overlay to handle click outside */}
      {showOptions && (
        <Pressable className="absolute inset-0 z-10" onPress={hideMenu} />
      )}

      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white">
        <View className="flex-row items-center">
          <Text className="text-2xl font-bold ml-2">[APP NAME]</Text>
        </View>
        <TouchableOpacity
          onPress={() => (showOptions ? hideMenu() : showMenu())}
          className="p-2 z-20"
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={showOptions ? "gray" : "black"}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-2">
        <View className="flex-row items-center bg-gray-200 rounded-lg px-4 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {/* Previous 7 Days Section */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center px-4 py-2">
            <Text className="text-lg text-gray-500">PREVIOUS 7 DAYS</Text>
            <Ionicons name="chevron-down" size={20} color="orange" />
          </View>
          {recordings
            .filter((r) => r.date === "12/17/24")
            .map((recording, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white p-4 flex-row justify-between items-center"
              >
                <Text className="text-gray-800">{recording.date}</Text>
                <Text className="text-gray-600">{recording.duration}</Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* February 2023 Section */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center px-4 py-2">
            <Text className="text-lg text-gray-500">FEBRUARY 2023</Text>
            <Ionicons name="chevron-down" size={20} color="orange" />
          </View>
          {recordings
            .filter((r) => r.date === "2/26/23")
            .map((recording, index) => (
              <TouchableOpacity key={index} className="bg-white p-4">
                <Text className="text-gray-800 mb-2">{recording.text}</Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">{recording.date}</Text>
                  <Text className="text-gray-600">{recording.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      {/* Record Button */}
      <View className="absolute bottom-8 left-0 right-0 items-center">
        <TouchableOpacity
          className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center"
          onPress={() => router.push("/(tabs)/recording")}
        >
          <Ionicons name="mic" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Options Menu */}
      {showOptions && (
        <Animated.View
          className="absolute right-4 bg-white rounded-lg shadow-sm p-2 w-72 z-20"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY }],
            top: 120,
          }}
        >
          <TouchableOpacity className="py-3 px-4 flex-row items-center justify-between border-b border-gray-100">
            <Text className="text-base">Import</Text>
            <Feather name="download" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="py-3 px-4 flex-row items-center justify-between border-b border-gray-100">
            <Text className="text-base">Manage Subscription</Text>
            <Feather name="shopping-cart" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="py-3 px-4 flex-row items-center justify-between border-b border-gray-100">
            <Text className="text-base">Restore Purchases</Text>
            <Feather name="tag" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="py-3 px-4 flex-row items-center justify-between border-b border-gray-100">
            <Text className="text-base">Send Feedback</Text>
            <Feather name="message-circle" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="py-3 px-4 flex-row items-center justify-between">
            <Text className="text-base">Terms and Privacy</Text>
            <Feather name="info" size={20} color="black" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
