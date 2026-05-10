import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

const icons = {
  chats: "chatbubbles",
  nearby: "radio",
  emergency: "warning",
  communities: "people",
  profile: "person-circle"
} as const;

type TabName = keyof typeof icons;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: route.name === "emergency" ? colors.offline : colors.online,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={icons[route.name as TabName] ?? "ellipse"} size={focused ? size + 2 : size} color={color} />
        )
      })}
    >
      <Tabs.Screen name="chats" options={{ title: "Chats" }} />
      <Tabs.Screen name="nearby" options={{ title: "Nearby" }} />
      <Tabs.Screen name="emergency" options={{ title: "SOS" }} />
      <Tabs.Screen name="communities" options={{ title: "Channels" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 26,
    borderWidth: 1,
    bottom: 16,
    height: 68,
    left: 16,
    paddingBottom: 10,
    paddingTop: 8,
    position: "absolute",
    right: 16
  },
  label: { fontSize: 11, fontWeight: "700" }
});
