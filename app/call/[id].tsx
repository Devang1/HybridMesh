import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { colors, shadows } from "@/constants/theme";
import { useChatStore } from "@/store/chatStore";

export default function CallScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = useChatStore((state) => state.chats[id]);

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.avatar}><Ionicons name="call" size={40} color={colors.success} /></View>
        <Text style={styles.name}>{chat?.title ?? "Secure call"}</Text>
        <Text style={styles.status}>Preparing encrypted calling architecture</Text>
        <View style={styles.actions}>
          <Pressable style={styles.secondary}><Ionicons name="mic-off" size={24} color={colors.textPrimary} /></Pressable>
          <Pressable onPress={() => router.back()} style={styles.end}><Ionicons name="call" size={28} color={colors.textPrimary} /></Pressable>
          <Pressable style={styles.secondary}><Ionicons name="videocam" size={24} color={colors.textPrimary} /></Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", flex: 1, justifyContent: "center", padding: 24 },
  avatar: { alignItems: "center", backgroundColor: "rgba(34,197,94,0.14)", borderRadius: 54, height: 108, justifyContent: "center", width: 108, ...shadows.glowOnline },
  name: { color: colors.textPrimary, fontSize: 28, fontWeight: "900", marginTop: 28 },
  status: { color: colors.textSecondary, fontSize: 14, marginTop: 8 },
  actions: { flexDirection: "row", gap: 24, marginTop: 60 },
  secondary: { alignItems: "center", backgroundColor: colors.card, borderRadius: 28, height: 56, justifyContent: "center", width: 56 },
  end: { alignItems: "center", backgroundColor: colors.error, borderRadius: 34, height: 68, justifyContent: "center", transform: [{ rotate: "135deg" }], width: 68 }
});
