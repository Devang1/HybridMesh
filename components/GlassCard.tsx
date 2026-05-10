import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { colors, radius } from "@/constants/theme";

export function GlassCard({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return (
    <BlurView intensity={18} tint="dark" style={[styles.card, style]}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(29,31,36,0.72)",
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
    padding: 16
  }
});
