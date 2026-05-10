import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { colors, radius, shadows } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("operator@meshlink.app");
  const signIn = useAuthStore((state) => state.signIn);

  const submit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signIn(email);
    router.replace("/(tabs)/chats");
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <View>
          <StatusPill mode="hybrid" label="HYBRID READY" />
          <Text style={styles.logo}>MeshLink</Text>
          <Text style={styles.tagline}>Messaging beyond the internet.</Text>
        </View>

        <LinearGradient colors={["rgba(59,130,246,0.20)", "rgba(249,115,22,0.12)"]} style={styles.panel}>
          <View style={styles.lock}>
            <Ionicons name="shield-checkmark" size={28} color={colors.online} />
          </View>
          <Text style={styles.title}>Secure operator access</Text>
          <Text style={styles.copy}>Expo-first realtime chat with offline queueing, relay simulation, and emergency channels.</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
          <Pressable onPress={submit} style={styles.button}>
            <Text style={styles.buttonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.textPrimary} />
          </Pressable>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", padding: 24 },
  logo: { color: colors.textPrimary, fontSize: 48, fontWeight: "900", letterSpacing: 0, marginTop: 28 },
  tagline: { color: colors.textSecondary, fontSize: 17, marginTop: 8 },
  panel: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 20,
    ...shadows.glowOnline
  },
  lock: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "800", marginTop: 18 },
  copy: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 8 },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 15,
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 13
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.online,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginTop: 14,
    padding: 15
  },
  buttonText: { color: colors.textPrimary, fontSize: 15, fontWeight: "800" }
});
