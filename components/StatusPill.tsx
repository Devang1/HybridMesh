import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { colors, radius, shadows } from "@/constants/theme";

type Props = {
  mode: "online" | "offline" | "hybrid";
  label?: string;
};

export function StatusPill({ mode, label }: Props) {
  const pulse = useSharedValue(0.6);
  const accent = mode === "offline" ? colors.offline : mode === "online" ? colors.online : colors.success;

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1100 }), -1, true);
  }, [pulse]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: pulse.value }]
  }));

  return (
    <View style={[styles.container, mode === "offline" ? shadows.glowOffline : shadows.glowOnline]}>
      <Animated.View style={[styles.dot, { backgroundColor: accent }, dotStyle]} />
      <Text style={styles.text}>{label ?? mode.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  dot: { borderRadius: 99, height: 8, width: 8 },
  text: { color: colors.textPrimary, fontSize: 12, fontWeight: "700", letterSpacing: 0 }
});
