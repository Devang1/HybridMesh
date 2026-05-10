import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { GlassCard } from "@/components/GlassCard";
import { StatusPill } from "@/components/StatusPill";
import { colors, radius } from "@/constants/theme";
import { flushPendingMessages } from "@/services/sync";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useNetworkStore } from "@/store/networkStore";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const pending = useChatStore((state) => state.pendingMessageIds.length);
  const mode = useNetworkStore((state) => state.mode);
  const setMode = useNetworkStore((state) => state.setMode);

  const logout = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <StatusPill mode={mode} />
      </View>

      <GlassCard style={styles.identity}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={34} color={colors.online} />
        </View>
        <Text style={styles.name}>{user?.name ?? "Mesh Operator"}</Text>
        <Text style={styles.handle}>{user?.handle}</Text>
        <Text style={styles.key}>Public key: {user?.publicKey.slice(0, 18)}...</Text>
      </GlassCard>

      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={() => setMode(mode === "offline" ? "hybrid" : "offline")}>
          <Ionicons name="swap-horizontal" size={20} color={colors.offline} />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Transport mode</Text>
            <Text style={styles.actionMeta}>Switch between hybrid and offline simulation.</Text>
          </View>
        </Pressable>
        <Pressable style={styles.action} onPress={flushPendingMessages}>
          <Ionicons name="sync" size={20} color={colors.online} />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Sync queue</Text>
            <Text style={styles.actionMeta}>{pending} pending messages cached locally.</Text>
          </View>
        </Pressable>
        <Pressable style={styles.action}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Security</Text>
            <Text style={styles.actionMeta}>Secure Store token, E2E-ready message model.</Text>
          </View>
        </Pressable>
      </View>

      <Pressable onPress={logout} style={styles.logout}>
        <Text style={styles.logoutText}>Sign out</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", padding: 20 },
  title: { color: colors.textPrimary, fontSize: 32, fontWeight: "900", letterSpacing: 0 },
  identity: { alignItems: "center", marginHorizontal: 16 },
  avatar: { alignItems: "center", backgroundColor: "rgba(59,130,246,0.13)", borderRadius: 36, height: 72, justifyContent: "center", width: 72 },
  name: { color: colors.textPrimary, fontSize: 23, fontWeight: "900", marginTop: 14 },
  handle: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  key: { color: colors.online, fontSize: 12, fontWeight: "800", marginTop: 12 },
  actions: { gap: 10, padding: 16 },
  action: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: 12, padding: 14 },
  actionTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: "900" },
  actionMeta: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
  logout: { alignItems: "center", borderColor: "rgba(239,68,68,0.45)", borderRadius: radius.md, borderWidth: 1, margin: 16, padding: 14 },
  logoutText: { color: colors.error, fontWeight: "900" }
});
