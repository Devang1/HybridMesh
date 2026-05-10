import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { GlassCard } from "@/components/GlassCard";
import { StatusPill } from "@/components/StatusPill";
import { colors, radius } from "@/constants/theme";
import { mockMeshTransport } from "@/services/transports/mockMeshTransport";
import { useNetworkStore } from "@/store/networkStore";

export default function NearbyScreen() {
  const setMeshPeers = useNetworkStore((state) => state.setMeshPeers);
  const pulse = useSharedValue(0.75);
  const { data = [] } = useQuery({ queryKey: ["nearby-peers"], queryFn: () => mockMeshTransport.scanPeers(), refetchInterval: 8000 });

  useEffect(() => setMeshPeers(data.length), [data.length, setMeshPeers]);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.12, { duration: 1400 }), -1, true);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }], opacity: 1.2 - pulse.value }));

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Mesh</Text>
        <StatusPill mode="offline" label={`${data.length} PEERS`} />
      </View>
      <GlassCard style={styles.radar}>
        <Animated.View style={[styles.ring, pulseStyle]} />
        <View style={styles.core}>
          <Ionicons name="radio" size={36} color={colors.offline} />
        </View>
        <Text style={styles.radarText}>Relay simulation active</Text>
      </GlassCard>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Animated.View entering={FadeIn.duration(240)} style={styles.peer}>
            <View style={styles.peerIcon}>
              <Ionicons name="phone-portrait" size={20} color={colors.offline} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.peerName}>{item.name}</Text>
              <Text style={styles.peerMeta}>{item.transport} · hop {item.hopCount} · battery {item.batteryLevel}%</Text>
            </View>
            <Text style={styles.signal}>{item.signalStrength}%</Text>
          </Animated.View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", padding: 20 },
  title: { color: colors.textPrimary, fontSize: 31, fontWeight: "900" },
  radar: { alignItems: "center", height: 220, justifyContent: "center", marginHorizontal: 16 },
  ring: { borderColor: "rgba(249,115,22,0.42)", borderRadius: 90, borderWidth: 2, height: 180, position: "absolute", width: 180 },
  core: { alignItems: "center", backgroundColor: "rgba(249,115,22,0.12)", borderRadius: 45, height: 90, justifyContent: "center", width: 90 },
  radarText: { color: colors.textSecondary, fontSize: 13, fontWeight: "700", marginTop: 18 },
  list: { gap: 10, padding: 16, paddingBottom: 110 },
  peer: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: 12, padding: 14 },
  peerIcon: { alignItems: "center", backgroundColor: "rgba(249,115,22,0.12)", borderRadius: 20, height: 40, justifyContent: "center", width: 40 },
  peerName: { color: colors.textPrimary, fontSize: 15, fontWeight: "800" },
  peerMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
  signal: { color: colors.offline, fontSize: 14, fontWeight: "900" }
});
