import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import MapView, { Marker } from "react-native-maps";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { colors, radius, shadows } from "@/constants/theme";
import { getEmergencyLocation } from "@/services/location";
import { notifyLocal } from "@/services/notifications";
import { useChatStore } from "@/store/chatStore";

export default function EmergencyScreen() {
  const [body, setBody] = useState("Need assistance at current location.");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>();
  const alerts = useChatStore((state) => state.emergencyAlerts);
  const createEmergencyAlert = useChatStore((state) => state.createEmergencyAlert);

  const broadcast = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const location = await getEmergencyLocation();
    if (location) setCoords(location);
    const label = location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Location pending";
    const alert = createEmergencyAlert(body, label);
    await notifyLocal(alert.title, alert.body);
    Alert.alert("SOS broadcasting", "Emergency alert queued for cloud and simulated mesh relay.");
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>PRIORITY NETWORK</Text>
          <Text style={styles.title}>Emergency</Text>
        </View>
        <StatusPill mode="offline" label="SOS READY" />
      </View>

      <View style={styles.mapWrap}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: coords?.latitude ?? 28.6139,
            longitude: coords?.longitude ?? 77.209,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04
          }}
          region={
            coords
              ? { latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }
              : undefined
          }
        >
          {coords ? <Marker coordinate={coords} title="SOS origin" pinColor={colors.offline} /> : null}
        </MapView>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Broadcast alert</Text>
        <TextInput value={body} onChangeText={setBody} multiline placeholderTextColor={colors.textSecondary} style={styles.input} />
        <Pressable onPress={broadcast} style={styles.sosButton}>
          <Ionicons name="warning" size={22} color={colors.textPrimary} />
          <Text style={styles.sosText}>Send SOS</Text>
        </Pressable>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.alert}>
            <View style={styles.alertIcon}>
              <Ionicons name="pulse" size={18} color={colors.offline} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{item.title}</Text>
              <Text style={styles.alertBody}>{item.body}</Text>
              <Text style={styles.alertMeta}>{item.locationLabel} · {item.status}</Text>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", padding: 20, paddingBottom: 12 },
  kicker: { color: colors.offline, fontSize: 12, fontWeight: "900" },
  title: { color: colors.textPrimary, fontSize: 32, fontWeight: "900", letterSpacing: 0 },
  mapWrap: { borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, height: 170, marginHorizontal: 16, overflow: "hidden" },
  panel: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, margin: 16, padding: 14 },
  panelTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: "900" },
  input: { color: colors.textPrimary, minHeight: 58, paddingVertical: 10 },
  sosButton: { alignItems: "center", backgroundColor: colors.offline, borderRadius: radius.md, flexDirection: "row", gap: 10, justifyContent: "center", padding: 14, ...shadows.glowOffline },
  sosText: { color: colors.textPrimary, fontSize: 15, fontWeight: "900" },
  list: { gap: 10, paddingHorizontal: 16, paddingBottom: 120 },
  alert: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: 12, padding: 13 },
  alertIcon: { alignItems: "center", backgroundColor: "rgba(249,115,22,0.14)", borderRadius: 18, height: 36, justifyContent: "center", width: 36 },
  alertTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: "800" },
  alertBody: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginTop: 3 },
  alertMeta: { color: colors.offline, fontSize: 11, fontWeight: "800", marginTop: 7 }
});
