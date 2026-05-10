import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/theme";

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: "800", letterSpacing: 0 },
  action: { color: colors.online, fontSize: 13, fontWeight: "700" }
});
