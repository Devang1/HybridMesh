import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusPill } from "@/components/StatusPill";
import { colors, radius } from "@/constants/theme";
import { useChatStore } from "@/store/chatStore";

export default function CommunitiesScreen() {
  const communities = useChatStore((state) => state.communities);

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>BROADCAST LAYERS</Text>
          <Text style={styles.title}>Communities</Text>
        </View>
        <StatusPill mode="hybrid" />
      </View>
      <View style={styles.body}>
        <SectionHeader title="Channels" action="Create" />
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const accent = item.mode === "offline" ? colors.offline : item.mode === "online" ? colors.online : colors.success;
            return (
              <Pressable onPress={() => Haptics.selectionAsync()} style={styles.channel}>
                <View style={[styles.channelIcon, { backgroundColor: `${accent}22` }]}>
                  <Ionicons name={item.mode === "offline" ? "git-network" : "megaphone"} size={22} color={accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={[styles.mode, { color: accent }]}>{item.mode}</Text>
                  </View>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.members}>{item.members.toLocaleString()} members · {item.unread} updates</Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", padding: 20 },
  kicker: { color: colors.success, fontSize: 12, fontWeight: "900" },
  title: { color: colors.textPrimary, fontSize: 31, fontWeight: "900", letterSpacing: 0 },
  body: { flex: 1, paddingHorizontal: 16 },
  list: { gap: 12, paddingBottom: 110 },
  channel: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: 14, padding: 15 },
  channelIcon: { alignItems: "center", borderRadius: 24, height: 48, justifyContent: "center", width: 48 },
  row: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  name: { color: colors.textPrimary, flex: 1, fontSize: 16, fontWeight: "900" },
  mode: { fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  description: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginTop: 5 },
  members: { color: colors.textPrimary, fontSize: 12, fontWeight: "700", marginTop: 10, opacity: 0.78 }
});
