import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/theme";

type Props = PropsWithChildren<{ style?: ViewStyle; edges?: ("top" | "bottom" | "left" | "right")[] }>;

export function Screen({ children, style, edges = ["top", "left", "right"] }: Props) {
  return (
    <LinearGradient colors={[colors.bg, "#10131A", colors.bg]} style={styles.gradient}>
      <SafeAreaView edges={edges} style={[styles.safe, style]}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, backgroundColor: "transparent" }
});
